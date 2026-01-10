import { useState } from 'react'
import { X, BedDouble, Bath, ExternalLink } from 'lucide-react'
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
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-4xl w-full my-8 shadow-2xl border border-cottage-sand"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {imageError ? (
            <div className="w-full h-96 bg-cottage-sand/50 flex items-center justify-center rounded-t-xl">
              <div className="text-center text-cottage-gray">
                <svg className="w-20 h-20 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">Image not available</p>
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
            className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm hover:bg-cottage-sand/50 text-cottage-charcoal rounded-lg w-10 h-10 flex items-center justify-center transition-all border border-cottage-sand shadow-md"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-cottage-charcoal px-4 py-2 rounded-lg font-bold text-xl shadow-md border border-cottage-sand">
            {option.code}
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-3xl font-bold text-cottage-charcoal mb-2">{option.nickname}</h2>
          <p className="text-lg text-cottage-gray mb-6">{option.title}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-cottage-sand/20 rounded-lg p-4 border border-cottage-sand">
              <div className="text-cottage-gray text-xs mb-1 font-medium">Location</div>
              <div className="text-cottage-charcoal font-semibold text-sm">{option.location}</div>
            </div>
            <div className="bg-cottage-sand/20 rounded-lg p-4 border border-cottage-sand">
              <div className="text-cottage-gray text-xs mb-1 font-medium">Per Night</div>
              <div className="text-cottage-charcoal font-semibold text-sm">${option.priceNight}</div>
            </div>
            <div className="bg-cottage-sand/20 rounded-lg p-4 border border-cottage-sand">
              <div className="text-cottage-gray text-xs mb-1 font-medium">Total Est.</div>
              <div className="text-cottage-charcoal font-semibold text-sm">${option.totalEstimate}</div>
            </div>
            <div className="bg-cottage-sand/20 rounded-lg p-4 border border-cottage-sand">
              <div className="text-cottage-gray text-xs mb-1 font-medium">Capacity</div>
              <div className="text-cottage-charcoal font-semibold text-sm">{option.guests} guests</div>
            </div>
          </div>

          <div className="flex gap-6 mb-6 text-cottage-charcoal">
            <div className="flex items-center gap-2.5 bg-cottage-sand/20 px-4 py-3 rounded-lg border border-cottage-sand">
              <BedDouble className="w-5 h-5 text-cottage-gray" />
              <span className="font-medium">{option.beds} Bedrooms</span>
            </div>
            <div className="flex items-center gap-2.5 bg-cottage-sand/20 px-4 py-3 rounded-lg border border-cottage-sand">
              <Bath className="w-5 h-5 text-cottage-gray" />
              <span className="font-medium">{option.baths} Bathrooms</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-cottage-charcoal font-semibold mb-3 text-base">Perks & Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {option.perks.map((perk, index) => (
                <span
                  key={index}
                  className="bg-cottage-tan/20 text-cottage-charcoal px-3.5 py-2 rounded-lg text-sm font-medium border border-cottage-tan/40"
                >
                  {perk}
                </span>
              ))}
            </div>
          </div>

          {option.notes && (
            <div className="mb-6 bg-cottage-sand/20 rounded-lg p-4 border border-cottage-sand">
              <h3 className="text-cottage-charcoal font-semibold mb-2 text-base">Notes</h3>
              <p className="text-cottage-gray leading-relaxed text-sm">{option.notes}</p>
            </div>
          )}

          {!isTBD ? (
            <a
              href={option.airbnbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-cottage-green hover:bg-cottage-green/90 text-white py-4 px-6 rounded-lg font-semibold text-base transition-all shadow-md hover:shadow-lg transform hover:scale-[1.01] group"
            >
              <span>View Full Listing on Airbnb</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          ) : (
            <div className="w-full bg-cottage-sand/30 border border-cottage-sand text-cottage-gray text-center py-4 px-6 rounded-lg font-medium italic text-sm">
              Airbnb listing details coming soon
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
