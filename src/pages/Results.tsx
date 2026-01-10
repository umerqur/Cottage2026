import { useState, useEffect } from 'react'
import { getOptions, getVotes } from '../lib/supabase'
import type { CottageOption, Vote } from '../types'

interface VoterVotes {
  voterName: string
  votes: Map<string, 'yes' | 'maybe' | 'no'>
}

export default function Results() {
  const [options, setOptions] = useState<CottageOption[]>([])
  const [votes, setVotes] = useState<Vote[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadResults()
  }, [])

  const loadResults = async () => {
    try {
      setLoading(true)
      const [optionsData, votesData] = await Promise.all([
        getOptions(),
        getVotes(),
      ])

      setOptions(optionsData)
      setVotes(votesData)
    } catch (err) {
      console.error('Error loading results:', err)
    } finally {
      setLoading(false)
    }
  }

  // Calculate winner (most "yes" votes)
  const getWinner = (): { option: CottageOption; yesCount: number } | null => {
    if (options.length === 0) return null

    const yesVotes = options.map((option) => ({
      option,
      yesCount: votes.filter((v) => v.optionId === option.id && v.voteValue === 'yes').length,
    }))

    return yesVotes.reduce((max, curr) => (curr.yesCount > max.yesCount ? curr : max))
  }

  // Group votes by voter
  const getVoterVotes = (): VoterVotes[] => {
    const voterMap = new Map<string, Map<string, 'yes' | 'maybe' | 'no'>>()

    votes.forEach((vote) => {
      if (!voterMap.has(vote.voterName)) {
        voterMap.set(vote.voterName, new Map())
      }
      voterMap.get(vote.voterName)!.set(vote.optionId, vote.voteValue)
    })

    return Array.from(voterMap.entries())
      .map(([voterName, votes]) => ({ voterName, votes }))
      .sort((a, b) => a.voterName.localeCompare(b.voterName))
  }

  const getVoteColor = (vote: 'yes' | 'maybe' | 'no' | undefined): string => {
    if (vote === 'yes') return 'bg-green-500'
    if (vote === 'maybe') return 'bg-yellow-500'
    if (vote === 'no') return 'bg-red-500'
    return 'bg-gray-500'
  }

  const getVoteLabel = (vote: 'yes' | 'maybe' | 'no' | undefined): string => {
    if (vote === 'yes') return 'Yes'
    if (vote === 'maybe') return 'Maybe'
    if (vote === 'no') return 'No'
    return 'N/A'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <div className="text-slate-300">Loading results...</div>
        </div>
      </div>
    )
  }

  const winner = getWinner()
  const voterVotes = getVoterVotes()

  return (
    <div>
      <h1 className="text-4xl font-bold text-white mb-8">Voting Results</h1>

      {/* Winner Announcement */}
      {winner && winner.yesCount > 0 && (
        <div className="mb-8 bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-2 border-green-500/50 rounded-2xl p-8 text-center">
          <div className="text-green-400 text-sm font-semibold uppercase tracking-wide mb-2">
            🏆 Current Winner
          </div>
          <div className="flex items-center justify-center gap-4 mb-2">
            <span className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-2xl">
              {winner.option.code}
            </span>
            <h2 className="text-3xl font-bold text-white">{winner.option.nickname}</h2>
          </div>
          <p className="text-green-300 text-lg">
            {winner.yesCount} {winner.yesCount === 1 ? 'vote' : 'votes'}
          </p>
          <p className="text-slate-400 text-sm mt-2">{winner.option.title}</p>
        </div>
      )}

      {/* Voter Bar Charts */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">📊 Individual Votes</h2>
        <p className="text-slate-400 mb-6">
          Each person's votes across all cottages
        </p>

        {voterVotes.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center text-slate-400">
            No votes yet. Be the first to vote!
          </div>
        ) : (
          <div className="space-y-6">
            {voterVotes.map((voterData) => (
              <div
                key={voterData.voterName}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">{voterData.voterName}</h3>

                <div className="space-y-3">
                  {options.map((option) => {
                    const vote = voterData.votes.get(option.id)
                    return (
                      <div key={option.id} className="flex items-center gap-4">
                        <div className="flex items-center gap-2 w-48">
                          <span className="bg-primary-600 text-white px-2 py-1 rounded font-bold text-sm">
                            {option.code}
                          </span>
                          <span className="text-slate-300 text-sm font-medium truncate">
                            {option.nickname}
                          </span>
                        </div>

                        <div className="flex-1 bg-slate-700/50 rounded-full h-8 flex items-center px-3">
                          <div
                            className={`${getVoteColor(vote)} h-6 rounded-full flex items-center justify-center transition-all duration-300 min-w-[60px] px-3`}
                            style={{ width: vote ? '100%' : '30%' }}
                          >
                            <span className="text-white text-sm font-semibold">
                              {getVoteLabel(vote)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
