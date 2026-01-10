import { useState, useEffect } from 'react'
import { getOptions, getVotes } from '../lib/supabase'
import type { CottageOption } from '../types'

interface VoteSummary {
  option: CottageOption
  yes: number
  maybe: number
  no: number
  total: number
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
        }
      })

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

  return (
    <div>
      <h1 className="text-4xl font-bold text-white mb-3">📊 Voting Results</h1>
      <p className="text-slate-400 mb-8">Real-time vote breakdown for all cottage options</p>

      <div className="space-y-6">
        {voteSummaries.map((summary) => {
          const { option, yes, maybe, no, total } = summary

          // Calculate percentages for bar segments
          const yesPercent = total > 0 ? (yes / total) * 100 : 0
          const maybePercent = total > 0 ? (maybe / total) * 100 : 0
          const noPercent = total > 0 ? (no / total) * 100 : 0

          return (
            <div
              key={option.id}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors"
            >
              {/* Label */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="bg-primary-600 text-white px-3 py-1.5 rounded-lg font-bold text-lg">
                    {option.code}
                  </span>
                  <span className="text-xl font-bold text-white">
                    {option.nickname}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">Total:</span>
                  <span className="bg-slate-700 text-white px-3 py-1 rounded-lg font-bold">
                    {total}
                  </span>
                </div>
              </div>

              {/* Horizontal Bar Chart */}
              {total > 0 ? (
                <div className="space-y-3">
                  <div className="flex h-12 rounded-lg overflow-hidden bg-slate-700/30">
                    {/* Yes segment */}
                    {yes > 0 && (
                      <div
                        className="bg-green-600 flex items-center justify-center text-white font-semibold transition-all hover:bg-green-500"
                        style={{ width: `${yesPercent}%` }}
                      >
                        {yesPercent >= 15 && (
                          <span className="text-sm flex items-center gap-1">
                            <span>👍</span>
                            <span>{yes}</span>
                          </span>
                        )}
                      </div>
                    )}

                    {/* Maybe segment */}
                    {maybe > 0 && (
                      <div
                        className="bg-yellow-600 flex items-center justify-center text-white font-semibold transition-all hover:bg-yellow-500"
                        style={{ width: `${maybePercent}%` }}
                      >
                        {maybePercent >= 15 && (
                          <span className="text-sm flex items-center gap-1">
                            <span>🤔</span>
                            <span>{maybe}</span>
                          </span>
                        )}
                      </div>
                    )}

                    {/* No segment */}
                    {no > 0 && (
                      <div
                        className="bg-red-600 flex items-center justify-center text-white font-semibold transition-all hover:bg-red-500"
                        style={{ width: `${noPercent}%` }}
                      >
                        {noPercent >= 15 && (
                          <span className="text-sm flex items-center gap-1">
                            <span>👎</span>
                            <span>{no}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Legend with counts */}
                  <div className="flex gap-4 justify-center">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-600 rounded"></div>
                      <span className="text-slate-300 text-sm">
                        👍 Yes: <span className="font-semibold text-white">{yes}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-600 rounded"></div>
                      <span className="text-slate-300 text-sm">
                        🤔 Maybe: <span className="font-semibold text-white">{maybe}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-600 rounded"></div>
                      <span className="text-slate-300 text-sm">
                        👎 No: <span className="font-semibold text-white">{no}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 bg-slate-700/20 rounded-lg">
                  No votes yet for this option
                </div>
              )}
            </div>
          )
        })}
      </div>

      {voteSummaries.every(s => s.total === 0) && (
        <div className="mt-8 text-center p-8 bg-slate-800 border border-slate-700 rounded-xl">
          <div className="text-slate-400 text-lg">
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
