import { useState, useEffect } from 'react'
import { User } from 'lucide-react'
import CottageCard from '../components/CottageCard'
import CottageModal from '../components/CottageModal'
import { getOptions, getUserVote, upsertVote, getVotes } from '../lib/supabase'
import type { CottageOption, VoteValue } from '../types'

export default function Home() {
  const [options, setOptions] = useState<CottageOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [voterName, setVoterName] = useState<string>('')
  const [namePrompt, setNamePrompt] = useState(true)
  const [userVotes, setUserVotes] = useState<Record<string, VoteValue>>({})
  const [selectedOption, setSelectedOption] = useState<CottageOption | null>(null)
  const [voteCounts, setVoteCounts] = useState<Record<string, { yes: number; maybe: number; no: number }>>({})

  useEffect(() => {
    // Check localStorage for saved name
    const savedName = localStorage.getItem('cottageVoterName')
    if (savedName) {
      setVoterName(savedName)
      setNamePrompt(false)
      loadData(savedName)
    } else {
      setLoading(false)
    }
  }, [])

  const loadData = async (name: string) => {
    try {
      setLoading(true)
      const [optionsData, allVotes] = await Promise.all([
        getOptions(),
        getVotes()
      ])

      setOptions(optionsData)

      // Load user's votes
      const votes: Record<string, VoteValue> = {}
      for (const option of optionsData) {
        const vote = await getUserVote(name, option.id)
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
      setError('Failed to load cottage options. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleSetName = (name: string) => {
    if (!name.trim()) return

    const trimmedName = name.trim()
    setVoterName(trimmedName)
    localStorage.setItem('cottageVoterName', trimmedName)
    setNamePrompt(false)
    loadData(trimmedName)
  }

  const handleVote = async (optionId: string, vote: VoteValue) => {
    if (!voterName) return

    try {
      await upsertVote({
        voterName,
        optionId,
        voteValue: vote,
      })

      setUserVotes((prev) => ({
        ...prev,
        [optionId]: vote,
      }))

      // Refresh vote counts
      const allVotes = await getVotes()
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
      alert('Failed to save your vote. Please try again.')
    }
  }

  if (namePrompt) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <div className="bg-slate-800 rounded-xl p-8 shadow-2xl border border-slate-700">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome to Cottage 2026!</h2>
          <p className="text-slate-300 mb-6">
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
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 mb-4 border border-slate-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            />
            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg"
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <div className="text-slate-300">Loading cottage options...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <div className="bg-red-900/20 border border-red-700 rounded-xl p-6 text-center">
          <div className="text-red-400 text-lg mb-2">⚠️ Error</div>
          <div className="text-slate-300">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Premium Header Bar */}
      <div className="mb-8 -mt-6 -mx-6 px-6 py-5 bg-slate-800/50 border-b border-slate-700/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white tracking-tight">Cottage 2026</h1>
          <div className="flex items-center gap-3 bg-slate-700/50 px-4 py-2 rounded-lg border border-slate-600/50">
            <User className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-300">
              Voting as <span className="font-semibold text-white">{voterName}</span>
            </span>
            <button
              onClick={() => {
                localStorage.removeItem('cottageVoterName')
                setNamePrompt(true)
                setVoterName('')
              }}
              className="ml-2 text-xs px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors font-medium"
            >
              Change
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-2">All Options</h2>
          <p className="text-slate-400 text-sm">
            Vote Yes, Maybe, or No for each cottage. Tap a card to view full details.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {options.map((option) => (
            <CottageCard
              key={option.id}
              option={option}
              userVote={userVotes[option.id]}
              onVote={handleVote}
              onViewDetails={setSelectedOption}
              voteCounts={voteCounts[option.id]}
            />
          ))}
        </div>
      </div>

      <CottageModal option={selectedOption} onClose={() => setSelectedOption(null)} />
    </div>
  )
}
