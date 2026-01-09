import type { CottageOption } from '../types'

interface CottageModalProps {
  option: CottageOption | null
  onClose: () => void
}

export default function CottageModal({ option, onClose }: CottageModalProps) {
  if (!option) return null

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
          <img
            src={option.imageUrls[0]}
            alt={option.nickname}
            className="w-full h-96 object-cover rounded-t-xl"
          />
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

          <a
            href={option.airbnbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-primary-600 hover:bg-primary-700 text-white text-center py-4 rounded-lg font-semibold transition-colors shadow-lg"
          >
            View on Airbnb →
          </a>
        </div>
      </div>
    </div>
  )
}
