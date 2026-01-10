import { useState } from 'react'
import type { CottageOption, VoteValue } from '../types'

interface CottageCardProps {
  option: CottageOption
  userVote?: VoteValue
  onVote: (optionId: string, vote: VoteValue) => void
  onViewDetails: (option: CottageOption) => void
  voteCounts?: {
    yes: number
    maybe: number
    no: number
  }
}

export default function CottageCard({ option, userVote, onVote, onViewDetails, voteCounts }: CottageCardProps) {
  const [isVoting, setIsVoting] = useState(false)
  const [imageError, setImageError] = useState(false)

  const totalVotes = voteCounts ? voteCounts.yes + voteCounts.maybe + voteCounts.no : 0

  // Check if this is a TBD placeholder cottage
  const isTBD = option.nickname === 'TBD' || option.title.includes('TBD')

  const handleVote = async (vote: VoteValue) => {
    setIsVoting(true)
    try {
      await onVote(option.id, vote)
    } finally {
      setIsVoting(false)
    }
  }

  const getVoteButtonClass = (vote: VoteValue) => {
    const isSelected = userVote === vote
    const baseClass = 'flex-1 py-2 px-3 rounded-lg font-medium transition-all'

    if (vote === 'yes') {
      return `${baseClass} ${
        isSelected
          ? 'bg-green-600 text-white shadow-lg'
          : 'bg-slate-700 text-slate-300 hover:bg-green-600/20 hover:text-green-400'
      }`
    } else if (vote === 'maybe') {
      return `${baseClass} ${
        isSelected
          ? 'bg-yellow-600 text-white shadow-lg'
          : 'bg-slate-700 text-slate-300 hover:bg-yellow-600/20 hover:text-yellow-400'
      }`
    } else {
      return `${baseClass} ${
        isSelected
          ? 'bg-red-600 text-white shadow-lg'
          : 'bg-slate-700 text-slate-300 hover:bg-red-600/20 hover:text-red-400'
      }`
    }
  }

  return (
    <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-700 hover:border-primary-500 transition-all">
      <div
        className="relative h-64 cursor-pointer group"
        onClick={() => onViewDetails(option)}
      >
        {imageError ? (
          <div className="w-full h-full bg-slate-700 flex items-center justify-center">
            <div className="text-center text-slate-400">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Image not available</p>
            </div>
          </div>
        ) : (
          <img
            src={option.imageUrls[0]}
            alt={option.nickname}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        )}
        <div className="absolute top-4 left-4 bg-primary-600 text-white px-4 py-2 rounded-lg font-bold text-xl shadow-lg">
          {option.code}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
          <span className="text-white font-medium">View Details</span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-1">{option.nickname}</h3>
        <p className="text-slate-400 text-sm mb-3">{option.location}</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-700/50 rounded-lg p-3">
            <div className="text-slate-400 text-xs mb-1">Per Night</div>
            <div className="text-white font-bold text-lg">${option.priceNight}</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3">
            <div className="text-slate-400 text-xs mb-1">Total Est.</div>
            <div className="text-white font-bold text-lg">${option.totalEstimate}</div>
          </div>
        </div>

        <div className="flex gap-4 mb-4 text-sm text-slate-300">
          <div className="flex items-center gap-1">
            <span>👥</span>
            <span>{option.guests} guests</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🛏️</span>
            <span>{option.beds} beds</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🚿</span>
            <span>{option.baths} baths</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {option.perks.slice(0, 3).map((perk, index) => (
            <span
              key={index}
              className="bg-primary-900/30 text-primary-300 px-3 py-1 rounded-full text-xs font-medium border border-primary-700/30"
            >
              {perk}
            </span>
          ))}
          {option.perks.length > 3 && (
            <span className="text-slate-400 text-xs py-1">
              +{option.perks.length - 3} more
            </span>
          )}
        </div>

        {/* Vote Count Badge */}
        {voteCounts && (
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary-600 text-white px-2.5 py-2.5 rounded text-sm font-bold leading-none min-w-[2.5rem] text-center">
                {totalVotes}
              </div>
              <div className="flex gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <span>👍</span>
                  <span className="text-slate-300 font-medium">{voteCounts.yes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>👎</span>
                  <span className="text-slate-300 font-medium">{voteCounts.no}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isTBD && (
          <div className="border-t border-slate-700 pt-4">
            <div className="text-slate-400 text-sm mb-2 font-medium">Your Vote</div>
            <div className="flex gap-2">
              <button
                onClick={() => handleVote('yes')}
                disabled={isVoting}
                className={getVoteButtonClass('yes')}
              >
                Yes
              </button>
              <button
                onClick={() => handleVote('maybe')}
                disabled={isVoting}
                className={getVoteButtonClass('maybe')}
              >
                Maybe
              </button>
              <button
                onClick={() => handleVote('no')}
                disabled={isVoting}
                className={getVoteButtonClass('no')}
              >
                No
              </button>
            </div>
          </div>
        )}
        {isTBD && (
          <div className="border-t border-slate-700 pt-4">
            <div className="text-slate-400 text-sm text-center italic">
              Details coming soon - voting not yet available
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
