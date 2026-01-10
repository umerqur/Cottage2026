import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Results from './pages/Results'
import Admin from './pages/Admin'
import { getRoomByJoinCode, DEFAULT_JOIN_CODE } from './lib/supabase'
import type { Room } from './types'

function Navigation() {
  const location = useLocation()
  const { joinCode } = useParams<{ joinCode: string }>()
  const baseUrl = `/r/${joinCode || DEFAULT_JOIN_CODE}`

  return (
    <nav className="bg-white border-b border-cottage-sand shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={baseUrl} className="text-2xl font-bold text-cottage-charcoal hover:text-cottage-green transition-colors">
            Cottage 2026
          </Link>
          <div className="flex gap-4">
            <Link
              to={baseUrl}
              className={`px-4 py-2 rounded-lg transition-colors ${
                location.pathname === baseUrl
                  ? 'bg-cottage-green text-white'
                  : 'text-cottage-gray hover:bg-cottage-sand/30 hover:text-cottage-charcoal'
              }`}
            >
              Vote
            </Link>
            <Link
              to={`${baseUrl}/results`}
              className={`px-4 py-2 rounded-lg transition-colors ${
                location.pathname === `${baseUrl}/results`
                  ? 'bg-cottage-green text-white'
                  : 'text-cottage-gray hover:bg-cottage-sand/30 hover:text-cottage-charcoal'
              }`}
            >
              Results
            </Link>
            <Link
              to={`${baseUrl}/admin`}
              className={`px-4 py-2 rounded-lg transition-colors ${
                location.pathname === `${baseUrl}/admin`
                  ? 'bg-cottage-green text-white'
                  : 'text-cottage-gray hover:bg-cottage-sand/30 hover:text-cottage-charcoal'
              }`}
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

function RoomLoader() {
  const { joinCode } = useParams<{ joinCode: string }>()
  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadRoom() {
      try {
        setLoading(true)
        setError(null)
        const roomData = await getRoomByJoinCode(joinCode || DEFAULT_JOIN_CODE)
        setRoom(roomData)
      } catch (err) {
        console.error('Error loading room:', err)
        setError('Room not found')
      } finally {
        setLoading(false)
      }
    }

    loadRoom()
  }, [joinCode])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-cottage-gray text-lg">Loading room...</div>
      </div>
    )
  }

  if (error || !room) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-red-600 text-lg">Room not found. Please check your link.</div>
      </div>
    )
  }

  return (
    <>
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Home roomId={room.id} />} />
          <Route path="/results" element={<Results roomId={room.id} />} />
          <Route path="/admin" element={<Admin roomId={room.id} />} />
        </Routes>
      </main>
    </>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-cottage-cream">
        <Routes>
          {/* Redirect root to default room */}
          <Route path="/" element={<Navigate to={`/r/${DEFAULT_JOIN_CODE}`} replace />} />

          {/* Room-specific routes */}
          <Route path="/r/:joinCode/*" element={<RoomLoader />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
