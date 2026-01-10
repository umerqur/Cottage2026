import { useState } from 'react'
import { X, BedDouble, Bath, MapPin, Users, ExternalLink, ImageOff } from 'lucide-react'
import type { CottageOption } from '../types'

interface CottageModalProps {
  option: CottageOption | null
  onClose: () => void
}

export default function CottageModal({ option, onClose }: CottageModalProps) {
  const [imageError, setImageError] = useState(false)

  if (!option) return null

  // Check if this is a TBD placeholder cottage
  const isTBD = option.nickname === 'TBD' || option.title.includes('TBD')

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-2xl max-w-4xl w-full my-8 shadow-2xl border border-slate-700/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {imageError ? (
            <div className="w-full h-96 bg-slate-700/50 flex flex-col items-center justify-center rounded-t-2xl">
              <ImageOff className="w-16 h-16 text-slate-500 mb-3" strokeWidth={1.5} />
              <p className="text-lg text-slate-400 font-medium">Image not available</p>
            </div>
          ) : (
            <>
              <img
                src={option.imageUrls[0]}
                alt={option.nickname}
                className="w-full h-96 object-cover rounded-t-2xl"
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/20 rounded-t-2xl" />
            </>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm hover:bg-slate-900 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all border border-slate-700/50 hover:border-slate-600"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
          <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-bold text-xl shadow-lg border border-slate-700/50">
            {option.code}
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">{option.nickname}</h2>
          <div className="flex items-center gap-2 text-slate-300 mb-6">
            <MapPin className="w-4 h-4 text-slate-400" strokeWidth={2} />
            <p className="text-lg">{option.title}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4">
              <div className="text-slate-400 text-sm mb-1.5 font-medium">Location</div>
              <div className="text-white font-semibold">{option.location}</div>
            </div>
            <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4">
              <div className="text-slate-400 text-sm mb-1.5 font-medium">Per Night</div>
              <div className="text-white font-semibold">${option.priceNight}</div>
            </div>
            <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4">
              <div className="text-slate-400 text-sm mb-1.5 font-medium">Total Est.</div>
              <div className="text-white font-semibold">${option.totalEstimate}</div>
            </div>
            <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4">
              <div className="text-slate-400 text-sm mb-1.5 font-medium">Capacity</div>
              <div className="text-white font-semibold flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-400" strokeWidth={2} />
                {option.guests}
              </div>
            </div>
          </div>

          <div className="flex gap-6 mb-6 text-slate-300">
            <div className="flex items-center gap-2">
              <BedDouble className="w-5 h-5 text-slate-400" strokeWidth={2} />
              <span className="font-medium">{option.beds} Bedrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="w-5 h-5 text-slate-400" strokeWidth={2} />
              <span className="font-medium">{option.baths} Bathrooms</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3 text-lg tracking-tight">Perks & Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {option.perks.map((perk, index) => (
                <span
                  key={index}
                  className="bg-slate-700/40 text-slate-300 px-4 py-2 rounded-lg text-sm font-medium border border-slate-600/30"
                >
                  {perk}
                </span>
              ))}
            </div>
          </div>

          {option.notes && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-2 text-lg tracking-tight">Notes</h3>
              <p className="text-slate-300 leading-relaxed">{option.notes}</p>
            </div>
          )}

          {!isTBD ? (
            <a
              href={option.airbnbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-[#FF385C] to-[#E61E4D] hover:from-[#E61E4D] hover:to-[#C13447] text-white py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] group"
            >
              <span>View Full Listing on Airbnb</span>
              <ExternalLink className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2} />
            </a>
          ) : (
            <div className="w-full bg-slate-700/50 border border-slate-600/30 text-slate-400 text-center py-4 px-6 rounded-xl font-semibold italic">
              Airbnb listing details coming soon
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
