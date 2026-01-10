import { useState } from 'react'
import { Users, BedDouble, Bath, MapPin, ExternalLink, ImageOff } from 'lucide-react'
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
    const baseClass = 'flex-1 h-10 rounded-lg font-medium transition-all duration-200 border'

    if (vote === 'yes') {
      return `${baseClass} ${
        isSelected
          ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 shadow-sm'
          : 'bg-transparent border-slate-600 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-600/10'
      }`
    } else if (vote === 'maybe') {
      return `${baseClass} ${
        isSelected
          ? 'bg-amber-600/20 border-amber-500 text-amber-400 shadow-sm'
          : 'bg-transparent border-slate-600 text-slate-400 hover:border-amber-500/50 hover:text-amber-400 hover:bg-amber-600/10'
      }`
    } else {
      return `${baseClass} ${
        isSelected
          ? 'bg-rose-600/20 border-rose-500 text-rose-400 shadow-sm'
          : 'bg-transparent border-slate-600 text-slate-400 hover:border-rose-500/50 hover:text-rose-400 hover:bg-rose-600/10'
      }`
    }
  }

  const score = voteCounts ? voteCounts.yes - voteCounts.no : 0

  return (
    <div className="bg-slate-800/50 rounded-xl shadow-lg overflow-hidden border border-slate-700/50 hover:border-slate-600 transition-all duration-300 backdrop-blur-sm flex flex-col">
      {/* Image Section with gradient overlay */}
      <div
        className="relative h-56 cursor-pointer group overflow-hidden"
        onClick={() => onViewDetails(option)}
      >
        {imageError ? (
          <div className="w-full h-full bg-slate-700/50 flex flex-col items-center justify-center">
            <ImageOff className="w-12 h-12 text-slate-500 mb-2" strokeWidth={1.5} />
            <p className="text-sm text-slate-500 font-medium">Image unavailable</p>
          </div>
        ) : (
          <>
            <img
              src={option.imageUrls[0]}
              alt={option.nickname}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20" />
          </>
        )}

        {/* Code badge - top left */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg font-bold text-sm border border-slate-700/50 shadow-lg">
          {option.code}
        </div>

        {/* Score badge - top right */}
        {voteCounts && (
          <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg font-bold text-sm border border-slate-700/50 shadow-lg min-w-[2.5rem] text-center">
            {score > 0 ? '+' : ''}{score}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title and Location */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-1.5 tracking-tight">{option.nickname}</h3>
          <div className="flex items-center gap-1.5 text-slate-400 text-sm">
            <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
            <span>{option.location}</span>
          </div>
        </div>

        {/* Price Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-3">
            <div className="text-slate-400 text-xs mb-1 font-medium">Per Night</div>
            <div className="text-white font-bold text-base">${option.priceNight}</div>
          </div>
          <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-3">
            <div className="text-slate-400 text-xs mb-1 font-medium">Total Est.</div>
            <div className="text-white font-bold text-base">${option.totalEstimate}</div>
          </div>
        </div>

        {/* Stats with icons */}
        <div className="flex items-center gap-4 mb-4 text-sm text-slate-300">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-slate-400" strokeWidth={2} />
            <span>{option.guests}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BedDouble className="w-4 h-4 text-slate-400" strokeWidth={2} />
            <span>{option.beds}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-slate-400" strokeWidth={2} />
            <span>{option.baths}</span>
          </div>
        </div>

        {/* Perks */}
        {option.perks.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {option.perks.slice(0, 3).map((perk, index) => (
              <span
                key={index}
                className="bg-slate-700/40 text-slate-300 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-600/30"
              >
                {perk}
              </span>
            ))}
            {option.perks.length > 3 && (
              <span className="text-slate-500 text-xs py-1 font-medium">
                +{option.perks.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Spacer to push buttons to bottom */}
        <div className="flex-1" />

        {/* Airbnb Link Button */}
        {!isTBD && (
          <a
            href={option.airbnbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 hover:border-slate-500 text-slate-300 hover:text-white py-2.5 rounded-lg transition-all duration-200 mb-4 group"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-sm font-medium">View on Airbnb</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2} />
          </a>
        )}

        {/* Vote Buttons */}
        {!isTBD && (
          <div className="border-t border-slate-700/50 pt-4">
            <div className="text-slate-400 text-xs mb-2.5 font-medium uppercase tracking-wide">Your Vote</div>
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
          <div className="border-t border-slate-700/50 pt-4">
            <div className="text-slate-500 text-sm text-center italic">
              Details coming soon
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
