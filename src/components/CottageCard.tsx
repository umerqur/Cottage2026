import { useState } from 'react'
import { Users, BedDouble, Bath, MapPin, ExternalLink } from 'lucide-react'
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
  highestScore?: number
}

export default function CottageCard({ option, userVote, onVote, onViewDetails, voteCounts, highestScore }: CottageCardProps) {
  const [isVoting, setIsVoting] = useState(false)
  const [imageError, setImageError] = useState(false)

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
    const baseClass = 'flex-1 h-10 px-3 rounded-lg font-medium transition-all border'

    if (vote === 'yes') {
      return `${baseClass} ${
        isSelected
          ? 'bg-emerald-600/10 border-emerald-600/50 text-emerald-400'
          : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-emerald-600/30 hover:text-emerald-400'
      }`
    } else if (vote === 'maybe') {
      return `${baseClass} ${
        isSelected
          ? 'bg-amber-600/10 border-amber-600/50 text-amber-400'
          : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-amber-600/30 hover:text-amber-400'
      }`
    } else {
      return `${baseClass} ${
        isSelected
          ? 'bg-rose-600/10 border-rose-600/50 text-rose-400'
          : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-rose-600/30 hover:text-rose-400'
      }`
    }
  }

  const scoreValue = voteCounts ? voteCounts.yes - voteCounts.no : 0
  const isHighestScore = highestScore !== undefined && scoreValue === highestScore && scoreValue > 0

  // Determine badge styling based on score
  const getBadgeClasses = () => {
    let baseClasses = 'ml-2 flex-shrink-0 px-2.5 py-1 rounded text-sm font-bold'

    if (scoreValue > 0) {
      // Positive score: green background with white text
      if (isHighestScore) {
        // Highest score: brighter green with ring
        return `${baseClasses} bg-emerald-500/90 text-white ring-2 ring-emerald-400/50`
      } else {
        // Regular positive: subtle green
        return `${baseClasses} bg-emerald-600/80 text-white`
      }
    } else if (scoreValue < 0) {
      // Negative score: red background with white text
      return `${baseClasses} bg-rose-600/80 text-white`
    } else {
      // Zero score: neutral gray
      return `${baseClasses} bg-slate-600/80 text-white`
    }
  }

  return (
    <div className="bg-slate-800/80 rounded-lg shadow-lg overflow-hidden border border-slate-700/50 hover:border-slate-600 transition-all backdrop-blur-sm flex flex-col">
      {/* Image Section with Gradient Overlay */}
      <div
        className="relative h-56 cursor-pointer group overflow-hidden"
        onClick={() => onViewDetails(option)}
      >
        {imageError ? (
          <div className="w-full h-full bg-slate-700/50 flex items-center justify-center">
            <div className="text-center text-slate-400">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs">Image unavailable</p>
            </div>
          </div>
        ) : (
          <>
            <img
              src={option.imageUrls[0]}
              alt={option.nickname}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
            {/* Subtle gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          </>
        )}

        {/* Code Badge */}
        <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-md font-bold text-sm shadow-lg border border-slate-700/50">
          {option.code}
        </div>

        {/* View Details Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white font-medium text-sm">View Details</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title and Location */}
        <div className="mb-4 flex-grow">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-white leading-tight">{option.nickname}</h3>
            {/* Score Badge - Top Right */}
            {voteCounts && (
              <div className={getBadgeClasses()}>
                {scoreValue > 0 ? `+${scoreValue}` : scoreValue}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-3">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{option.location}</span>
          </div>

          {/* Price Section */}
          <div className="grid grid-cols-2 gap-2.5 mb-3">
            <div className="bg-slate-700/30 backdrop-blur-sm rounded-md p-2.5 border border-slate-700/50">
              <div className="text-slate-400 text-xs mb-0.5 font-medium">Per Night</div>
              <div className="text-white font-bold">${option.priceNight}</div>
            </div>
            <div className="bg-slate-700/30 backdrop-blur-sm rounded-md p-2.5 border border-slate-700/50">
              <div className="text-slate-400 text-xs mb-0.5 font-medium">Total Est.</div>
              <div className="text-white font-bold">${option.totalEstimate}</div>
            </div>
          </div>

          {/* Stats with Lucide Icons */}
          <div className="flex gap-4 text-sm text-slate-300 mb-3">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-slate-400" />
              <span>{option.guests}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-4 h-4 text-slate-400" />
              <span>{option.beds}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-slate-400" />
              <span>{option.baths}</span>
            </div>
          </div>

          {/* Perks */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {option.perks.slice(0, 3).map((perk, index) => (
              <span
                key={index}
                className="bg-slate-700/40 text-slate-300 px-2.5 py-0.5 rounded text-xs font-medium border border-slate-600/30"
              >
                {perk}
              </span>
            ))}
            {option.perks.length > 3 && (
              <span className="text-slate-400 text-xs py-0.5">
                +{option.perks.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Airbnb Link Button */}
        {!isTBD && (
          <a
            href={option.airbnbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-slate-700/40 hover:bg-slate-700 border border-slate-600/50 hover:border-slate-500 text-slate-300 hover:text-white py-2.5 px-3 rounded-lg transition-all mb-3 text-sm font-medium group"
            onClick={(e) => e.stopPropagation()}
          >
            <span>View on Airbnb</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        )}

        {/* Voting Section */}
        {!isTBD && (
          <div className="pt-3 border-t border-slate-700/50">
            <div className="text-slate-400 text-xs mb-2 font-medium">Your Vote</div>
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
          <div className="pt-3 border-t border-slate-700/50">
            <div className="text-slate-400 text-xs text-center italic">
              Details coming soon - voting not yet available
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
