import { useState, useEffect } from 'react'
import { getOptions, getVotes, getRankings } from '../lib/supabase'
import type { CottageOption, Vote, Ranking, VoteSummary, RankingSummary } from '../types'

export default function Results() {
  const [options, setOptions] = useState<CottageOption[]>([])
  const [voteSummaries, setVoteSummaries] = useState<VoteSummary[]>([])
  const [rankingSummaries, setRankingSummaries] = useState<RankingSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedOption, setExpandedOption] = useState<string | null>(null)

  useEffect(() => {
    loadResults()
  }, [])

  const loadResults = async () => {
    try {
      setLoading(true)
      const [optionsData, votesData, rankingsData] = await Promise.all([
        getOptions(),
        getVotes(),
        getRankings(),
      ])

      setOptions(optionsData)
      setVoteSummaries(computeVoteSummaries(optionsData, votesData))
      setRankingSummaries(computeRankingSummaries(optionsData, rankingsData))
    } catch (err) {
      console.error('Error loading results:', err)
    } finally {
      setLoading(false)
    }
  }

  const computeVoteSummaries = (
    options: CottageOption[],
    votes: Vote[]
  ): VoteSummary[] => {
    return options.map((option) => {
      const optionVotes = votes.filter((v) => v.optionId === option.id)
      return {
        optionId: option.id,
        yes: optionVotes.filter((v) => v.voteValue === 'yes').length,
        maybe: optionVotes.filter((v) => v.voteValue === 'maybe').length,
        no: optionVotes.filter((v) => v.voteValue === 'no').length,
        voters: optionVotes.map((v) => ({
          name: v.voterName,
          vote: v.voteValue,
        })),
      }
    })
  }

  const computeRankingSummaries = (
    options: CottageOption[],
    rankings: Ranking[]
  ): RankingSummary[] => {
    const summaries = options.map((option) => {
      const firstPlaceVotes = rankings.filter((r) => r.firstOptionId === option.id).length
      const secondPlaceVotes = rankings.filter((r) => r.secondOptionId === option.id).length
      const points = firstPlaceVotes * 2 + secondPlaceVotes * 1

      return {
        optionId: option.id,
        points,
        firstPlaceVotes,
        secondPlaceVotes,
      }
    })

    // Sort by points descending
    return summaries.sort((a, b) => b.points - a.points)
  }

  const getOption = (id: string) => options.find((o) => o.id === id)

  const toggleExpanded = (optionId: string) => {
    setExpandedOption(expandedOption === optionId ? null : optionId)
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

  return (
    <div>
      <h1 className="text-4xl font-bold text-white mb-8">Voting Results</h1>

      {/* Top 2 Leaderboard */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">🏆 Top 2 Leaderboard</h2>
        <p className="text-slate-400 mb-6">
          Ranked by points: First choice = 2 points, Second choice = 1 point
        </p>

        <div className="space-y-3">
          {rankingSummaries.map((summary, index) => {
            const option = getOption(summary.optionId)
            if (!option) return null

            const isTop = index < 3
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''

            return (
              <div
                key={option.id}
                className={`bg-slate-800 border rounded-xl p-6 transition-all ${
                  isTop
                    ? 'border-primary-500 shadow-lg shadow-primary-500/20'
                    : 'border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{medal || `#${index + 1}`}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-primary-600 text-white px-3 py-1 rounded-lg font-bold">
                          {option.code}
                        </span>
                        <span className="text-xl font-bold text-white">
                          {option.nickname}
                        </span>
                      </div>
                      <div className="text-slate-400 text-sm mt-1">
                        {summary.firstPlaceVotes} × 1st place, {summary.secondPlaceVotes} × 2nd
                        place
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary-400">
                      {summary.points}
                    </div>
                    <div className="text-slate-400 text-sm">points</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Vote Tallies */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">📊 Vote Breakdown</h2>
        <p className="text-slate-400 mb-6">
          See how everyone voted on each option. Click to expand voter details.
        </p>

        <div className="space-y-4">
          {voteSummaries.map((summary) => {
            const option = getOption(summary.optionId)
            if (!option) return null

            const total = summary.yes + summary.maybe + summary.no
            const isExpanded = expandedOption === option.id

            return (
              <div
                key={option.id}
                className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleExpanded(option.id)}
                  className="w-full p-6 text-left hover:bg-slate-750 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="bg-primary-600 text-white px-3 py-1 rounded-lg font-bold text-lg">
                        {option.code}
                      </span>
                      <span className="text-xl font-bold text-white">
                        {option.nickname}
                      </span>
                    </div>
                    <div className="text-slate-400">
                      {total} {total === 1 ? 'vote' : 'votes'}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                      <div className="text-green-400 text-sm mb-1">Yes</div>
                      <div className="text-2xl font-bold text-white">{summary.yes}</div>
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4">
                      <div className="text-yellow-400 text-sm mb-1">Maybe</div>
                      <div className="text-2xl font-bold text-white">{summary.maybe}</div>
                    </div>
                    <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
                      <div className="text-red-400 text-sm mb-1">No</div>
                      <div className="text-2xl font-bold text-white">{summary.no}</div>
                    </div>
                  </div>

                  <div className="mt-4 text-center text-sm text-slate-400">
                    {isExpanded ? '▲ Click to hide voters' : '▼ Click to show who voted'}
                  </div>
                </button>

                {isExpanded && summary.voters.length > 0 && (
                  <div className="border-t border-slate-700 p-6">
                    <h4 className="text-white font-semibold mb-3">Voter Breakdown</h4>
                    <div className="space-y-2">
                      {summary.voters.map((voter, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-slate-700/50 rounded-lg px-4 py-2"
                        >
                          <span className="text-slate-300">{voter.name}</span>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              voter.vote === 'yes'
                                ? 'bg-green-900/40 text-green-400'
                                : voter.vote === 'maybe'
                                ? 'bg-yellow-900/40 text-yellow-400'
                                : 'bg-red-900/40 text-red-400'
                            }`}
                          >
                            {voter.vote === 'yes' ? 'Yes' : voter.vote === 'maybe' ? 'Maybe' : 'No'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isExpanded && summary.voters.length === 0 && (
                  <div className="border-t border-slate-700 p-6 text-center text-slate-400">
                    No votes yet for this option
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
