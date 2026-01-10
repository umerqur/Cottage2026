import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Results from './pages/Results'
import Admin from './pages/Admin'

function Navigation() {
  const location = useLocation()

  return (
    <nav className="bg-white border-b border-cottage-sand shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-cottage-charcoal hover:text-cottage-green transition-colors">
            Cottage 2026
          </Link>
          <div className="flex gap-4">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg transition-colors ${
                location.pathname === '/'
                  ? 'bg-cottage-green text-white'
                  : 'text-cottage-gray hover:bg-cottage-sand/30 hover:text-cottage-charcoal'
              }`}
            >
              Vote
            </Link>
            <Link
              to="/results"
              className={`px-4 py-2 rounded-lg transition-colors ${
                location.pathname === '/results'
                  ? 'bg-cottage-green text-white'
                  : 'text-cottage-gray hover:bg-cottage-sand/30 hover:text-cottage-charcoal'
              }`}
            >
              Results
            </Link>
            <Link
              to="/admin"
              className={`px-4 py-2 rounded-lg transition-colors ${
                location.pathname === '/admin'
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

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-cottage-cream">
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
