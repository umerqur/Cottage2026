import { useState, useEffect } from 'react'
import { Trophy, Medal, Award } from 'lucide-react'
import { getOptions, getVotes } from '../lib/supabase'
import type { CottageOption } from '../types'

interface VoteSummary {
  option: CottageOption
  yes: number
  maybe: number
  no: number
  total: number
  score: number
}

export default function Results() {
  const [voteSummaries, setVoteSummaries] = useState<VoteSummary[]>([])
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

      const summaries: VoteSummary[] = optionsData.map((option) => {
        const optionVotes = votesData.filter((v) => v.optionId === option.id)
        const yes = optionVotes.filter((v) => v.voteValue === 'yes').length
        const maybe = optionVotes.filter((v) => v.voteValue === 'maybe').length
        const no = optionVotes.filter((v) => v.voteValue === 'no').length

        return {
          option,
          yes,
          maybe,
          no,
          total: yes + maybe + no,
          score: yes - no,
        }
      })

      // Sort by score (yes - no) descending
      summaries.sort((a, b) => b.score - a.score)

      setVoteSummaries(summaries)
    } catch (err) {
      console.error('Error loading results:', err)
    } finally {
      setLoading(false)
    }
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

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-amber-400" />
    if (index === 1) return <Medal className="w-5 h-5 text-slate-300" />
    if (index === 2) return <Award className="w-5 h-5 text-amber-600" />
    return null
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Results Dashboard</h1>
      <p className="text-slate-400 mb-8 text-sm">Real-time vote summary for all cottage options</p>

      {/* Leaderboard Section */}
      {voteSummaries.length > 0 && voteSummaries.some(s => s.total > 0) && (
        <div className="mb-8 bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Top Choices
          </h2>
          <div className="space-y-3">
            {voteSummaries.slice(0, 3).map((summary, index) => {
              if (summary.total === 0) return null
              return (
                <div
                  key={summary.option.id}
                  className="flex items-center gap-4 bg-slate-800/60 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50"
                >
                  <div className="flex items-center justify-center w-8">
                    {getRankIcon(index)}
                  </div>
                  <div className="bg-slate-700/80 text-white px-3 py-1.5 rounded font-bold text-sm min-w-[2.5rem] text-center">
                    {summary.option.code}
                  </div>
                  <div className="flex-grow">
                    <div className="text-white font-semibold">{summary.option.nickname}</div>
                    <div className="text-slate-400 text-xs">{summary.option.location}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-lg">
                      {summary.score > 0 ? `+${summary.score}` : summary.score}
                    </div>
                    <div className="text-slate-400 text-xs">{summary.total} votes</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Vote Breakdown Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white mb-4">Vote Breakdown</h2>
        {voteSummaries.map((summary) => {
          const { option, yes, maybe, no, total, score } = summary

          // Calculate percentages for bar segments
          const yesPercent = total > 0 ? (yes / total) * 100 : 0
          const maybePercent = total > 0 ? (maybe / total) * 100 : 0
          const noPercent = total > 0 ? (no / total) * 100 : 0

          return (
            <div
              key={option.id}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-5 hover:border-slate-600/50 transition-all"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="bg-slate-700/80 text-white px-3 py-1.5 rounded font-bold text-sm">
                    {option.code}
                  </span>
                  <div>
                    <span className="text-white font-semibold">
                      {option.nickname}
                    </span>
                    <div className="text-slate-400 text-xs">{option.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-slate-400 text-xs">Score</div>
                    <div className="text-white font-bold">
                      {score > 0 ? `+${score}` : score}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-400 text-xs">Total</div>
                    <div className="text-white font-bold">
                      {total}
                    </div>
                  </div>
                </div>
              </div>

              {/* Horizontal Bar Chart */}
              {total > 0 ? (
                <div className="space-y-3">
                  <div className="flex h-10 rounded-lg overflow-hidden bg-slate-700/20 border border-slate-700/30">
                    {/* Yes segment - Muted emerald */}
                    {yes > 0 && (
                      <div
                        className="bg-emerald-700/80 flex items-center justify-center text-white text-sm font-semibold transition-all hover:bg-emerald-700"
                        style={{ width: `${yesPercent}%` }}
                      >
                        {yesPercent >= 12 && (
                          <span>{yes}</span>
                        )}
                      </div>
                    )}

                    {/* Maybe segment - Muted amber */}
                    {maybe > 0 && (
                      <div
                        className="bg-amber-700/80 flex items-center justify-center text-white text-sm font-semibold transition-all hover:bg-amber-700"
                        style={{ width: `${maybePercent}%` }}
                      >
                        {maybePercent >= 12 && (
                          <span>{maybe}</span>
                        )}
                      </div>
                    )}

                    {/* No segment - Muted rose */}
                    {no > 0 && (
                      <div
                        className="bg-rose-800/80 flex items-center justify-center text-white text-sm font-semibold transition-all hover:bg-rose-800"
                        style={{ width: `${noPercent}%` }}
                      >
                        {noPercent >= 12 && (
                          <span>{no}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Legend */}
                  <div className="flex gap-6 justify-center text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-700/80 rounded"></div>
                      <span className="text-slate-400">
                        Yes: <span className="font-semibold text-slate-300">{yes}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-amber-700/80 rounded"></div>
                      <span className="text-slate-400">
                        Maybe: <span className="font-semibold text-slate-300">{maybe}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-rose-800/80 rounded"></div>
                      <span className="text-slate-400">
                        No: <span className="font-semibold text-slate-300">{no}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 bg-slate-700/10 rounded-lg border border-slate-700/20 text-sm">
                  No votes yet for this option
                </div>
              )}
            </div>
          )
        })}
      </div>

      {voteSummaries.every(s => s.total === 0) && (
        <div className="mt-8 text-center p-8 bg-slate-800/50 border border-slate-700/50 rounded-lg backdrop-blur-sm">
          <div className="text-slate-400">
            No votes have been cast yet. Head to the{' '}
            <a href="/" className="text-primary-400 hover:text-primary-300 font-semibold">
              Home page
            </a>
            {' '}to start voting!
          </div>
        </div>
      )}
    </div>
  )
}
