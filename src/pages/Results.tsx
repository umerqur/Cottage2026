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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cottage-green mx-auto mb-4"></div>
          <div className="text-cottage-gray">Loading results...</div>
        </div>
      </div>
    )
  }

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-cottage-amber" />
    if (index === 1) return <Medal className="w-5 h-5 text-cottage-gray" />
    if (index === 2) return <Award className="w-5 h-5 text-cottage-tan" />
    return null
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-cottage-charcoal mb-2">Results Dashboard</h1>
      <p className="text-cottage-gray mb-8 text-sm">Real-time vote summary for all cottage options</p>

      {/* Leaderboard Section */}
      {voteSummaries.length > 0 && voteSummaries.some(s => s.total > 0) && (
        <div className="mb-8 bg-white border border-cottage-sand rounded-lg p-6 shadow-md">
          <h2 className="text-lg font-semibold text-cottage-charcoal mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-cottage-amber" />
            Top Choices
          </h2>
          <div className="space-y-3">
            {voteSummaries.slice(0, 3).map((summary, index) => {
              if (summary.total === 0) return null
              return (
                <div
                  key={summary.option.id}
                  className="flex items-center gap-4 bg-cottage-sand/20 rounded-lg p-4 border border-cottage-sand"
                >
                  <div className="flex items-center justify-center w-8">
                    {getRankIcon(index)}
                  </div>
                  <div className="bg-cottage-green text-white px-3 py-1.5 rounded font-bold text-sm min-w-[2.5rem] text-center">
                    {summary.option.code}
                  </div>
                  <div className="flex-grow">
                    <div className="text-cottage-charcoal font-semibold">{summary.option.nickname}</div>
                    <div className="text-cottage-gray text-xs">{summary.option.location}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-cottage-charcoal font-bold text-lg">
                      {summary.score > 0 ? `+${summary.score}` : summary.score}
                    </div>
                    <div className="text-cottage-gray text-xs">{summary.total} votes</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Vote Breakdown Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-cottage-charcoal mb-4">Vote Breakdown</h2>
        {voteSummaries.map((summary) => {
          const { option, yes, maybe, no, total, score } = summary

          // Calculate percentages for bar segments
          const yesPercent = total > 0 ? (yes / total) * 100 : 0
          const maybePercent = total > 0 ? (maybe / total) * 100 : 0
          const noPercent = total > 0 ? (no / total) * 100 : 0

          return (
            <div
              key={option.id}
              className="bg-white border border-cottage-sand rounded-lg p-5 hover:border-cottage-tan/50 transition-all shadow-sm"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="bg-cottage-green text-white px-3 py-1.5 rounded font-bold text-sm">
                    {option.code}
                  </span>
                  <div>
                    <span className="text-cottage-charcoal font-semibold">
                      {option.nickname}
                    </span>
                    <div className="text-cottage-gray text-xs">{option.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-cottage-gray text-xs">Score</div>
                    <div className="text-cottage-charcoal font-bold">
                      {score > 0 ? `+${score}` : score}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-cottage-gray text-xs">Total</div>
                    <div className="text-cottage-charcoal font-bold">
                      {total}
                    </div>
                  </div>
                </div>
              </div>

              {/* Horizontal Bar Chart */}
              {total > 0 ? (
                <div className="space-y-3">
                  <div className="flex h-10 rounded-lg overflow-hidden bg-cottage-sand/30 border border-cottage-sand">
                    {/* Yes segment - Green */}
                    {yes > 0 && (
                      <div
                        className="bg-cottage-green flex items-center justify-center text-white text-sm font-semibold transition-all hover:bg-cottage-green/90"
                        style={{ width: `${yesPercent}%` }}
                      >
                        {yesPercent >= 12 && (
                          <span>{yes}</span>
                        )}
                      </div>
                    )}

                    {/* Maybe segment - Amber */}
                    {maybe > 0 && (
                      <div
                        className="bg-cottage-amber flex items-center justify-center text-white text-sm font-semibold transition-all hover:bg-cottage-amber/90"
                        style={{ width: `${maybePercent}%` }}
                      >
                        {maybePercent >= 12 && (
                          <span>{maybe}</span>
                        )}
                      </div>
                    )}

                    {/* No segment - Red */}
                    {no > 0 && (
                      <div
                        className="bg-cottage-red flex items-center justify-center text-white text-sm font-semibold transition-all hover:bg-cottage-red/90"
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
                      <div className="w-3 h-3 bg-cottage-green rounded"></div>
                      <span className="text-cottage-gray">
                        Yes: <span className="font-semibold text-cottage-charcoal">{yes}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-cottage-amber rounded"></div>
                      <span className="text-cottage-gray">
                        Maybe: <span className="font-semibold text-cottage-charcoal">{maybe}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-cottage-red rounded"></div>
                      <span className="text-cottage-gray">
                        No: <span className="font-semibold text-cottage-charcoal">{no}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-cottage-gray bg-cottage-sand/20 rounded-lg border border-cottage-sand text-sm">
                  No votes yet for this option
                </div>
              )}
            </div>
          )
        })}
      </div>

      {voteSummaries.every(s => s.total === 0) && (
        <div className="mt-8 text-center p-8 bg-white border border-cottage-sand rounded-lg shadow-md">
          <div className="text-cottage-gray">
            No votes have been cast yet. Head to the{' '}
            <a href="/" className="text-cottage-green hover:text-cottage-green/80 font-semibold">
              Home page
            </a>
            {' '}to start voting!
          </div>
        </div>
      )}
    </div>
  )
}
