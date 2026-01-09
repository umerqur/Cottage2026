import { useState, useEffect } from 'react'
import CottageCard from '../components/CottageCard'
import CottageModal from '../components/CottageModal'
import RankingPicker from '../components/RankingPicker'
import { getOptions, getUserVote, upsertVote, getUserRanking, upsertRanking } from '../lib/supabase'
import type { CottageOption, VoteValue } from '../types'

export default function Home() {
  const [options, setOptions] = useState<CottageOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [voterName, setVoterName] = useState<string>('')
  const [namePrompt, setNamePrompt] = useState(true)
  const [userVotes, setUserVotes] = useState<Record<string, VoteValue>>({})
  const [selectedOption, setSelectedOption] = useState<CottageOption | null>(null)
  const [currentRanking, setCurrentRanking] = useState<{ first?: string; second?: string }>({})

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
      const [optionsData, rankingData] = await Promise.all([
        getOptions(),
        getUserRanking(name),
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

      // Load user's ranking
      if (rankingData) {
        setCurrentRanking({
          first: rankingData.firstOptionId,
          second: rankingData.secondOptionId,
        })
      }
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
    } catch (err) {
      console.error('Error saving vote:', err)
      alert('Failed to save your vote. Please try again.')
    }
  }

  const handleSaveRanking = async (firstId: string, secondId: string) => {
    if (!voterName) return

    await upsertRanking({
      voterName,
      firstOptionId: firstId,
      secondOptionId: secondId,
    })

    setCurrentRanking({
      first: firstId,
      second: secondId,
    })
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Choose Your Cottage</h1>
          <p className="text-slate-300">
            Voting as <span className="font-semibold text-primary-400">{voterName}</span>
            <button
              onClick={() => {
                localStorage.removeItem('cottageVoterName')
                setNamePrompt(true)
                setVoterName('')
              }}
              className="ml-3 text-sm text-slate-400 hover:text-white transition-colors"
            >
              (change)
            </button>
          </p>
        </div>
      </div>

      <div className="mb-8">
        <RankingPicker
          options={options}
          currentFirstId={currentRanking.first}
          currentSecondId={currentRanking.second}
          onSave={handleSaveRanking}
        />
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">All Options</h2>
        <p className="text-slate-400 mb-6">
          Vote Yes, Maybe, or No for each cottage. Tap a card to view full details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {options.map((option) => (
          <CottageCard
            key={option.id}
            option={option}
            userVote={userVotes[option.id]}
            onVote={handleVote}
            onViewDetails={setSelectedOption}
          />
        ))}
      </div>

      <CottageModal option={selectedOption} onClose={() => setSelectedOption(null)} />
    </div>
  )
}
