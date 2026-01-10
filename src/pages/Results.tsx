import { useState, useEffect } from 'react'
import { Trophy, Medal } from 'lucide-react'
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

      // Sort by score (descending)
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <div className="text-slate-400">Loading results...</div>
        </div>
      </div>
    )
  }

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-amber-400" strokeWidth={2} />
    if (index === 1) return <Medal className="w-5 h-5 text-slate-300" strokeWidth={2} />
    if (index === 2) return <Medal className="w-5 h-5 text-amber-700" strokeWidth={2} />
    return null
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1 tracking-tight">Vote Results</h1>
        <p className="text-slate-400 text-sm">Live voting dashboard for all cottage options</p>
      </div>

      {voteSummaries.every(s => s.total === 0) ? (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 text-center backdrop-blur-sm">
          <div className="text-slate-400 text-lg">
            No votes have been cast yet. Head to the{' '}
            <a href="/" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Home page
            </a>
            {' '}to start voting
          </div>
        </div>
      ) : (
        <>
          {/* Leaderboard */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 tracking-tight">Leaderboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {voteSummaries.slice(0, 3).map((summary, index) => (
                <div
                  key={summary.option.id}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 backdrop-blur-sm hover:border-slate-600 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getRankIcon(index)}
                      <span className="text-slate-400 text-sm font-semibold">
                        #{index + 1}
                      </span>
                    </div>
                    <div className="bg-slate-700/50 px-2.5 py-1 rounded-md">
                      <span className="text-white font-bold text-sm">{summary.option.code}</span>
                    </div>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">{summary.option.nickname}</h3>
                  <p className="text-slate-400 text-xs mb-3">{summary.option.location}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                    <span className="text-slate-400 text-xs font-medium">Score</span>
                    <span className="text-white font-bold text-xl">
                      {summary.score > 0 ? '+' : ''}{summary.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Full Results */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 tracking-tight">All Cottages</h2>
            <div className="space-y-4">
              {voteSummaries.map((summary, index) => {
                const { option, yes, maybe, no, total, score } = summary

                // Calculate percentages for bar segments
                const yesPercent = total > 0 ? (yes / total) * 100 : 0
                const maybePercent = total > 0 ? (maybe / total) * 100 : 0
                const noPercent = total > 0 ? (no / total) * 100 : 0

                return (
                  <div
                    key={option.id}
                    className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 backdrop-blur-sm hover:border-slate-600 transition-all"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {index < 3 && getRankIcon(index)}
                          <span className="text-slate-500 text-sm font-semibold">#{index + 1}</span>
                        </div>
                        <div className="bg-slate-700/50 px-3 py-1.5 rounded-lg">
                          <span className="text-white font-bold text-sm">{option.code}</span>
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-base">{option.nickname}</h3>
                          <p className="text-slate-400 text-xs">{option.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-slate-400 text-xs mb-0.5">Score</div>
                          <div className="text-white font-bold text-lg">
                            {score > 0 ? '+' : ''}{score}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-slate-400 text-xs mb-0.5">Votes</div>
                          <div className="text-white font-bold text-lg">{total}</div>
                        </div>
                      </div>
                    </div>

                    {/* Horizontal Bar Chart */}
                    {total > 0 ? (
                      <div className="space-y-3">
                        <div className="flex h-10 rounded-lg overflow-hidden bg-slate-700/30 border border-slate-600/30">
                          {/* Yes segment */}
                          {yes > 0 && (
                            <div
                              className="bg-emerald-600/80 hover:bg-emerald-600 flex items-center justify-center text-white font-semibold transition-all relative group"
                              style={{ width: `${yesPercent}%` }}
                            >
                              {yesPercent >= 12 && (
                                <span className="text-sm font-bold">{yes}</span>
                              )}
                            </div>
                          )}

                          {/* Maybe segment */}
                          {maybe > 0 && (
                            <div
                              className="bg-amber-600/80 hover:bg-amber-600 flex items-center justify-center text-white font-semibold transition-all relative group"
                              style={{ width: `${maybePercent}%` }}
                            >
                              {maybePercent >= 12 && (
                                <span className="text-sm font-bold">{maybe}</span>
                              )}
                            </div>
                          )}

                          {/* No segment */}
                          {no > 0 && (
                            <div
                              className="bg-rose-600/80 hover:bg-rose-600 flex items-center justify-center text-white font-semibold transition-all relative group"
                              style={{ width: `${noPercent}%` }}
                            >
                              {noPercent >= 12 && (
                                <span className="text-sm font-bold">{no}</span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Legend */}
                        <div className="flex gap-4 justify-center text-xs">
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 bg-emerald-600/80 rounded-sm"></div>
                            <span className="text-slate-400">
                              Yes: <span className="font-semibold text-slate-300">{yes}</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 bg-amber-600/80 rounded-sm"></div>
                            <span className="text-slate-400">
                              Maybe: <span className="font-semibold text-slate-300">{maybe}</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 bg-rose-600/80 rounded-sm"></div>
                            <span className="text-slate-400">
                              No: <span className="font-semibold text-slate-300">{no}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-slate-500 bg-slate-700/20 rounded-lg text-sm">
                        No votes yet
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
