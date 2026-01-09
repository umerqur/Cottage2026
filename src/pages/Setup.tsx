export default function Setup() {
  return (
    <div className="max-w-2xl mx-auto mt-20">
      <div className="bg-slate-800 rounded-xl p-8 shadow-2xl border border-slate-700">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">⚙️</div>
          <h2 className="text-3xl font-bold text-white mb-2">Admin Setup Required</h2>
        </div>

        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 mb-6">
          <p className="text-yellow-200 text-sm">
            This app needs Supabase configuration to work. Please set up the following environment variables in Netlify.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <h3 className="text-xl font-semibold text-white">Required Environment Variables:</h3>

          <div className="bg-slate-900 rounded-lg p-4 border border-slate-600">
            <code className="text-primary-400 text-sm block mb-2">VITE_SUPABASE_URL</code>
            <p className="text-slate-400 text-sm">
              Your Supabase project URL (e.g., https://xxxxx.supabase.co)
            </p>
          </div>

          <div className="bg-slate-900 rounded-lg p-4 border border-slate-600">
            <code className="text-primary-400 text-sm block mb-2">VITE_SUPABASE_ANON_KEY</code>
            <p className="text-slate-400 text-sm">
              Your Supabase anonymous/public key
            </p>
          </div>
        </div>

        <div className="bg-slate-900 rounded-lg p-4 border border-slate-600 mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Setup Steps:</h3>
          <ol className="space-y-2 text-slate-300 text-sm list-decimal list-inside">
            <li>Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">supabase.com</a></li>
            <li>Run the <code className="text-primary-400 bg-slate-800 px-2 py-1 rounded">supabase-schema.sql</code> script in your Supabase SQL editor</li>
            <li>Get your project URL and anon key from Settings → API in Supabase dashboard</li>
            <li>Add both environment variables to your Netlify site settings</li>
            <li>Redeploy your site on Netlify</li>
          </ol>
        </div>

        <div className="text-center">
          <a
            href="https://app.netlify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg"
          >
            Go to Netlify Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
