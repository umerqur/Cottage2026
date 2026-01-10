import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, Users } from 'lucide-react'
import { createRoom, generateJoinCode } from '../lib/supabase'

export default function Landing() {
  const [roomName, setRoomName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!roomName.trim()) {
      setError('Please enter a room name')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const joinCode = generateJoinCode()

      await createRoom({
        name: roomName.trim(),
        joinCode,
      })

      // Redirect to the new room
      navigate(`/r/${joinCode}`)
    } catch (err) {
      console.error('Error creating room:', err)
      setError('Failed to create room. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cottage-sand/30 via-white to-cottage-green/10 flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-cottage-green rounded-2xl mb-6 shadow-lg">
            <Home className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-cottage-charcoal mb-3 tracking-tight">
            Cottage 2026
          </h1>
          <p className="text-cottage-gray text-lg">
            Create a room to vote on cottage options with your group
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-cottage-sand">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-cottage-green/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-cottage-green" />
              </div>
              <h2 className="text-2xl font-bold text-cottage-charcoal">Create Room</h2>
            </div>
            <p className="text-cottage-gray text-sm">
              Give your voting room a name and we'll generate a shareable link for your group.
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-cottage-red/10 border border-cottage-red rounded-lg p-4">
              <div className="text-cottage-red text-sm font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleCreateRoom}>
            <div className="mb-6">
              <label htmlFor="roomName" className="block text-sm font-semibold text-cottage-charcoal mb-2">
                Room Name
              </label>
              <input
                id="roomName"
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="e.g., Smith Family Cottage Trip"
                autoFocus
                className="w-full bg-white text-cottage-charcoal rounded-lg px-4 py-3 border border-cottage-sand focus:border-cottage-green focus:ring-2 focus:ring-cottage-green/20 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cottage-green hover:bg-cottage-green/90 disabled:bg-cottage-gray/50 text-white font-semibold py-4 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Room...' : 'Create Room'}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-cottage-gray">
          <p>Once created, you'll get a shareable link to invite others to vote</p>
        </div>
      </div>
    </div>
  )
}
