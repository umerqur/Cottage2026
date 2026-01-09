import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Results from './pages/Results'
import Admin from './pages/Admin'
import Setup from './pages/Setup'
import { isSupabaseConfigured } from './lib/supabase'

function Navigation() {
  const location = useLocation()

  return (
    <nav className="bg-slate-800 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-white hover:text-primary-400 transition-colors">
            Cottage 2026
          </Link>
          <div className="flex gap-4">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg transition-colors ${
                location.pathname === '/'
                  ? 'bg-primary-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              Vote
            </Link>
            <Link
              to="/results"
              className={`px-4 py-2 rounded-lg transition-colors ${
                location.pathname === '/results'
                  ? 'bg-primary-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              Results
            </Link>
            <Link
              to="/admin"
              className={`px-4 py-2 rounded-lg transition-colors ${
                location.pathname === '/admin'
                  ? 'bg-primary-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
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

function App() {
  // If Supabase is not configured, show setup screen
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Setup />
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-900">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
