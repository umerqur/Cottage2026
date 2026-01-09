import { useState, useEffect } from 'react'
import type { CottageOption } from '../types'

interface RankingPickerProps {
  options: CottageOption[]
  currentFirstId?: string
  currentSecondId?: string
  onSave: (firstId: string, secondId: string) => Promise<void>
}

export default function RankingPicker({
  options,
  currentFirstId,
  currentSecondId,
  onSave,
}: RankingPickerProps) {
  const [firstChoice, setFirstChoice] = useState(currentFirstId || '')
  const [secondChoice, setSecondChoice] = useState(currentSecondId || '')
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (currentFirstId) setFirstChoice(currentFirstId)
    if (currentSecondId) setSecondChoice(currentSecondId)
  }, [currentFirstId, currentSecondId])

  const handleSave = async () => {
    if (!firstChoice || !secondChoice) {
      setMessage('Please select both your top 2 choices')
      return
    }

    if (firstChoice === secondChoice) {
      setMessage('Your top 2 choices must be different')
      return
    }

    setIsSaving(true)
    setMessage('')

    try {
      await onSave(firstChoice, secondChoice)
      setMessage('✓ Top 2 saved!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Failed to save. Please try again.')
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const getOptionLabel = (optionId: string) => {
    const option = options.find((o) => o.id === optionId)
    return option ? `${option.code} • ${option.nickname}` : ''
  }

  return (
    <div className="bg-gradient-to-br from-primary-900/20 to-purple-900/20 border border-primary-700/30 rounded-xl p-6 shadow-xl">
      <h3 className="text-2xl font-bold text-white mb-2">Pick Your Top 2</h3>
      <p className="text-slate-300 mb-6">
        Help us decide by ranking your favorite two options
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-slate-300 font-medium mb-2">
            🥇 First Choice (2 points)
          </label>
          <select
            value={firstChoice}
            onChange={(e) => setFirstChoice(e.target.value)}
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
          >
            <option value="">Select your top choice</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.code} • {option.nickname}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-2">
            🥈 Second Choice (1 point)
          </label>
          <select
            value={secondChoice}
            onChange={(e) => setSecondChoice(e.target.value)}
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
          >
            <option value="">Select your second choice</option>
            {options.map((option) => (
              <option key={option.id} value={option.id} disabled={option.id === firstChoice}>
                {option.code} • {option.nickname}
              </option>
            ))}
          </select>
        </div>
      </div>

      {firstChoice && secondChoice && firstChoice !== secondChoice && (
        <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
          <div className="text-slate-400 text-sm mb-2">Your Top 2:</div>
          <div className="text-white">
            <div className="font-semibold">1️⃣ {getOptionLabel(firstChoice)}</div>
            <div className="font-semibold">2️⃣ {getOptionLabel(secondChoice)}</div>
          </div>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={isSaving || !firstChoice || !secondChoice}
        className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg"
      >
        {isSaving ? 'Saving...' : 'Save Top 2'}
      </button>

      {message && (
        <div
          className={`mt-4 text-center font-medium ${
            message.includes('✓') ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  )
}
