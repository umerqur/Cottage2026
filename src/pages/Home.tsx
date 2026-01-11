import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { User, Share2, Plus, CheckCircle, Copy } from 'lucide-react'
import CottageCard from '../components/CottageCard'
import CottageModal from '../components/CottageModal'
import { getOptions, getUserVote, upsertVote, getVotes } from '../lib/supabase'
import type { CottageOption, VoteValue } from '../types'

interface HomeProps {
  roomId: string
}

export default function Home({ roomId }: HomeProps) {
  const { joinCode } = useParams<{ joinCode: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [options, setOptions] = useState<CottageOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [voterName, setVoterName] = useState<string>('')
  const [namePrompt, setNamePrompt] = useState(true)
  const [userVotes, setUserVotes] = useState<Record<string, VoteValue>>({})
  const [selectedOption, setSelectedOption] = useState<CottageOption | null>(null)
  const [voteCounts, setVoteCounts] = useState<Record<string, { yes: number; maybe: number; no: number }>>({})
  const [showCreatedBanner, setShowCreatedBanner] = useState(false)

  useEffect(() => {
    // Check if room was just created
    const created = searchParams.get('created')
    if (created === 'true') {
      setShowCreatedBanner(true)
      // Remove the query parameter from URL
      searchParams.delete('created')
      setSearchParams(searchParams, { replace: true })
    }
  }, [searchParams, setSearchParams])

  useEffect(() => {
    // Check localStorage for saved name (room-scoped)
    const savedName = localStorage.getItem(`cottageVoterName:${joinCode}`)
    if (savedName) {
      setVoterName(savedName)
      setNamePrompt(false)
      loadData(savedName)
    } else {
      setLoading(false)
    }
  }, [joinCode])

  const loadData = async (name: string) => {
    try {
      setLoading(true)
      setError(null)
      const [optionsData, allVotes] = await Promise.all([
        getOptions(roomId),
        getVotes(roomId)
      ])

      setOptions(optionsData)

      // Load user's votes
      const votes: Record<string, VoteValue> = {}
      for (const option of optionsData) {
        const vote = await getUserVote(roomId, name, option.id)
        if (vote) {
          votes[option.id] = vote.voteValue
        }
      }
      setUserVotes(votes)

      // Compute vote counts for all options
      const counts: Record<string, { yes: number; maybe: number; no: number }> = {}
      for (const option of optionsData) {
        const optionVotes = allVotes.filter((v) => v.optionId === option.id)
        counts[option.id] = {
          yes: optionVotes.filter((v) => v.voteValue === 'yes').length,
          maybe: optionVotes.filter((v) => v.voteValue === 'maybe').length,
          no: optionVotes.filter((v) => v.voteValue === 'no').length,
        }
      }
      setVoteCounts(counts)
    } catch (err) {
      console.error('Error loading data:', err)
      // Show the actual error message
      const errorMessage = err instanceof Error ? err.message : 'Failed to load cottage options.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSetName = (name: string) => {
    if (!name.trim()) return

    const trimmedName = name.trim()
    setVoterName(trimmedName)
    localStorage.setItem(`cottageVoterName:${joinCode}`, trimmedName)
    setNamePrompt(false)
    loadData(trimmedName)
  }

  const handleVote = async (optionId: string, vote: VoteValue) => {
    if (!voterName) return

    try {
      await upsertVote({
        roomId,
        voterName,
        optionId,
        voteValue: vote,
      })

      setUserVotes((prev) => ({
        ...prev,
        [optionId]: vote,
      }))

      // Refresh vote counts
      const allVotes = await getVotes(roomId)
      const counts: Record<string, { yes: number; maybe: number; no: number }> = {}
      for (const option of options) {
        const optionVotes = allVotes.filter((v) => v.optionId === option.id)
        counts[option.id] = {
          yes: optionVotes.filter((v) => v.voteValue === 'yes').length,
          maybe: optionVotes.filter((v) => v.voteValue === 'maybe').length,
          no: optionVotes.filter((v) => v.voteValue === 'no').length,
        }
      }
      setVoteCounts(counts)
    } catch (err) {
      console.error('Error saving vote:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to save your vote. Please try again.'
      alert(errorMessage)
    }
  }

  const handleShareLink = () => {
    const url = window.location.href.split('/results')[0].split('/admin')[0]
    navigator.clipboard.writeText(url).then(() => {
      alert('Room link copied to clipboard!')
    }).catch(() => {
      alert('Failed to copy link. Please copy manually: ' + url)
    })
  }

  if (namePrompt) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <div className="bg-white rounded-xl p-8 shadow-xl border border-cottage-sand">
          <h2 className="text-3xl font-bold text-cottage-charcoal mb-2">Welcome to Cottage 2026!</h2>
          <p className="text-cottage-gray mb-6">
            Please enter your name to start voting on cottage options
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const input = e.currentTarget.elements.namedItem('name') as HTMLInputElement
              handleSetName(input.value)
            }}
          >
            <input
              name="name"
              type="text"
              placeholder="Your name"
              autoFocus
              className="w-full bg-white text-cottage-charcoal rounded-lg px-4 py-3 mb-4 border border-cottage-sand focus:border-cottage-green focus:ring-2 focus:ring-cottage-green/20 outline-none transition-all"
            />
            <button
              type="submit"
              className="w-full bg-cottage-green hover:bg-cottage-green/90 text-white font-semibold py-3 rounded-lg transition-colors shadow-md"
            >
              Start Voting
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cottage-green mx-auto mb-4"></div>
          <div className="text-cottage-gray">Loading cottage options...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <div className="bg-cottage-red/10 border border-cottage-red rounded-xl p-6 text-center">
          <div className="text-cottage-red text-lg mb-2">⚠️ Error</div>
          <div className="text-cottage-gray">{error}</div>
        </div>
      </div>
    )
  }

  const handleCopyJoinCode = () => {
    navigator.clipboard.writeText(joinCode || '').then(() => {
      alert('Join code copied to clipboard!')
    }).catch(() => {
      alert('Failed to copy join code')
    })
  }

  const handleCopyShareableLink = () => {
    const shareableUrl = `${window.location.origin}/r/${joinCode}`
    navigator.clipboard.writeText(shareableUrl).then(() => {
      alert('Shareable link copied to clipboard!')
    }).catch(() => {
      alert('Failed to copy link')
    })
  }

  return (
    <div>
      {/* Room Created Success Banner */}
      {showCreatedBanner && (
        <div className="mb-6 -mt-6 -mx-6 px-6 py-4 bg-gradient-to-r from-cottage-green to-cottage-green/90 border-b-4 border-cottage-green shadow-lg">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Room Created Successfully!</h3>
                <p className="text-white/90 mb-4">Share this join code or link with your group to start voting together.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  {/* Join Code */}
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
                    <div className="text-white/80 text-sm font-medium mb-2">Join Code</div>
                    <div className="flex items-center justify-between gap-3">
                      <code className="text-2xl font-bold text-white tracking-wider">{joinCode}</code>
                      <button
                        onClick={handleCopyJoinCode}
                        className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors border border-white/30"
                      >
                        <Copy className="w-4 h-4" />
                        <span className="text-sm font-medium">Copy</span>
                      </button>
                    </div>
                  </div>

                  {/* Shareable Link */}
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
                    <div className="text-white/80 text-sm font-medium mb-2">Shareable Link</div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm text-white/90 font-mono truncate">
                        {window.location.origin}/r/{joinCode}
                      </div>
                      <button
                        onClick={handleCopyShareableLink}
                        className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors border border-white/30 flex-shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                        <span className="text-sm font-medium">Copy</span>
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowCreatedBanner(false)}
                  className="text-white/80 hover:text-white text-sm font-medium underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Premium Header Bar */}
      <div className="mb-8 -mt-6 -mx-6 px-6 py-5 bg-white border-b border-cottage-sand shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-cottage-charcoal tracking-tight">Cottage 2026</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handleShareLink}
              className="flex items-center gap-2 px-4 py-2 bg-cottage-green hover:bg-cottage-green/90 text-white rounded-lg transition-colors shadow-md font-medium"
            >
              <Share2 className="w-4 h-4" />
              Share Link
            </button>
            <div className="flex items-center gap-3 bg-cottage-sand/30 px-4 py-2 rounded-lg border border-cottage-sand">
              <User className="w-4 h-4 text-cottage-gray" />
              <span className="text-sm text-cottage-gray">
                Voting as <span className="font-semibold text-cottage-charcoal">{voterName}</span>
              </span>
              <button
                onClick={() => {
                  localStorage.removeItem(`cottageVoterName:${joinCode}`)
                  setNamePrompt(true)
                  setVoterName('')
                }}
                className="ml-2 text-xs px-3 py-1 bg-cottage-green hover:bg-cottage-green/90 text-white rounded transition-colors font-medium"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {options.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-cottage-sand rounded-full mb-6">
              <Plus className="w-10 h-10 text-cottage-gray" />
            </div>
            <h2 className="text-2xl font-bold text-cottage-charcoal mb-3">No listings yet</h2>
            <p className="text-cottage-gray mb-8 max-w-md mx-auto">
              Ask the admin to add cottages, then voting will appear
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate(`/r/${joinCode}/admin`)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-cottage-green hover:bg-cottage-green/90 text-white font-semibold rounded-lg transition-colors shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Add listings
              </button>
              <button
                onClick={handleCopyShareableLink}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-cottage-sand/30 border border-cottage-sand text-cottage-charcoal font-semibold rounded-lg transition-colors shadow-lg"
              >
                <Copy className="w-5 h-5" />
                Copy invite link
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-cottage-charcoal mb-2">All Options</h2>
              <p className="text-cottage-gray text-sm">
                Vote Yes, Maybe, or No for each cottage. Tap a card to view full details.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {options.map((option) => {
                // Calculate highest score across all options
                const allScores = options.map((opt) => {
                  const counts = voteCounts[opt.id]
                  return counts ? counts.yes - counts.no : 0
                })
                const highestScore = Math.max(...allScores)

                return (
                  <CottageCard
                    key={option.id}
                    option={option}
                    userVote={userVotes[option.id]}
                    onVote={handleVote}
                    onViewDetails={setSelectedOption}
                    voteCounts={voteCounts[option.id]}
                    highestScore={highestScore}
                  />
                )
              })}
            </div>
          </>
        )}
      </div>

      <CottageModal option={selectedOption} onClose={() => setSelectedOption(null)} />
    </div>
  )
}
