import { useState } from 'react'
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
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-xl max-w-4xl w-full my-8 shadow-2xl border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {imageError ? (
            <div className="w-full h-96 bg-slate-700 flex items-center justify-center rounded-t-xl">
              <div className="text-center text-slate-400">
                <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg">Image not available</p>
              </div>
            </div>
          ) : (
            <img
              src={option.imageUrls[0]}
              alt={option.nickname}
              className="w-full h-96 object-cover rounded-t-xl"
              onError={() => setImageError(true)}
            />
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
          <div className="absolute top-4 left-4 bg-primary-600 text-white px-4 py-2 rounded-lg font-bold text-2xl shadow-lg">
            {option.code}
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-3xl font-bold text-white mb-2">{option.nickname}</h2>
          <p className="text-xl text-slate-300 mb-6">{option.title}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="text-slate-400 text-sm mb-1">Location</div>
              <div className="text-white font-semibold">{option.location}</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="text-slate-400 text-sm mb-1">Per Night</div>
              <div className="text-white font-semibold">${option.priceNight}</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="text-slate-400 text-sm mb-1">Total Est.</div>
              <div className="text-white font-semibold">${option.totalEstimate}</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="text-slate-400 text-sm mb-1">Capacity</div>
              <div className="text-white font-semibold">{option.guests} guests</div>
            </div>
          </div>

          <div className="flex gap-6 mb-6 text-slate-300">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛏️</span>
              <span className="font-medium">{option.beds} Bedrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚿</span>
              <span className="font-medium">{option.baths} Bathrooms</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3 text-lg">Perks & Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {option.perks.map((perk, index) => (
                <span
                  key={index}
                  className="bg-primary-900/30 text-primary-300 px-4 py-2 rounded-lg text-sm font-medium border border-primary-700/30"
                >
                  {perk}
                </span>
              ))}
            </div>
          </div>

          {option.notes && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-2 text-lg">Notes</h3>
              <p className="text-slate-300 leading-relaxed">{option.notes}</p>
            </div>
          )}

          {!isTBD ? (
            <a
              href={option.airbnbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gradient-to-r from-[#FF385C] to-[#E61E4D] hover:from-[#E61E4D] hover:to-[#C13447] text-white text-center py-5 px-6 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span>View Full Listing on Airbnb</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ) : (
            <div className="block w-full bg-slate-700 text-slate-400 text-center py-5 px-6 rounded-lg font-semibold italic">
              Airbnb listing details coming soon
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
