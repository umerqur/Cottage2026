import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function DeleteOptions() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const deleteOptionsEandF = async () => {
    setLoading(true)
    setMessage('')
    setError('')

    try {
      // First, get the IDs of options E and F
      const { data: options, error: fetchError } = await supabase
        .from('options')
        .select('id, code, nickname')
        .in('code', ['E', 'F'])

      if (fetchError) throw fetchError

      if (!options || options.length === 0) {
        setMessage('✓ Options E and F do not exist in the database (already deleted)')
        setLoading(false)
        return
      }

      setMessage(`Found ${options.length} option(s) to delete: ${options.map(o => `${o.code}: ${o.nickname}`).join(', ')}`)

      const optionIds = options.map(opt => opt.id)

      // Delete votes for these options
      const { error: votesError } = await supabase
        .from('votes')
        .delete()
        .in('optionId', optionIds)

      if (votesError) throw votesError

      // Delete rankings that reference these options
      await supabase
        .from('rankings')
        .delete()
        .or(`firstOptionId.in.(${optionIds.join(',')}),secondOptionId.in.(${optionIds.join(',')})`)
      // Ignore rankings error if table doesn't exist

      // Delete the options themselves
      const { error: deleteError } = await supabase
        .from('options')
        .delete()
        .in('code', ['E', 'F'])

      if (deleteError) throw deleteError

      // Verify deletion
      const { data: remainingOptions, error: verifyError } = await supabase
        .from('options')
        .select('code, nickname')
        .order('code', { ascending: true })

      if (verifyError) throw verifyError

      setMessage(
        `✅ SUCCESS! Options E and F deleted.\n\nRemaining options:\n${remainingOptions?.map(o => `${o.code}: ${o.nickname}`).join('\n')}`
      )
    } catch (err) {
      setError(`❌ ERROR: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Delete Options E & F</h1>

          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              This will permanently delete options E (Ski Chalet/Eagle Point) and F (Island Cottage/TBD)
              from the database, along with all associated votes and rankings.
            </p>
            <p className="text-red-600 font-semibold">
              ⚠️ This action cannot be undone!
            </p>
          </div>

          <button
            onClick={deleteOptionsEandF}
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 active:scale-95'
            }`}
          >
            {loading ? 'Deleting...' : 'Delete Options E & F'}
          </button>

          {message && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <pre className="text-green-800 whitespace-pre-wrap font-mono text-sm">
                {message}
              </pre>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <pre className="text-red-800 whitespace-pre-wrap font-mono text-sm">
                {error}
              </pre>
            </div>
          )}

          <div className="mt-8">
            <a
              href="/"
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
