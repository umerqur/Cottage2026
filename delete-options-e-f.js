// Script to delete options E and F from Supabase database
// Run with: node delete-options-e-f.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Missing Supabase credentials')
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function deleteOptionsEandF() {
  console.log('Starting deletion of options E and F...')

  try {
    // First, get the IDs of options E and F
    const { data: options, error: fetchError } = await supabase
      .from('options')
      .select('id, code, nickname')
      .in('code', ['E', 'F'])

    if (fetchError) throw fetchError

    if (!options || options.length === 0) {
      console.log('✓ Options E and F do not exist in the database (already deleted)')
      return
    }

    console.log(`Found ${options.length} option(s) to delete:`)
    options.forEach(opt => console.log(`  - ${opt.code}: ${opt.nickname}`))

    const optionIds = options.map(opt => opt.id)

    // Delete votes for these options
    console.log('\n1. Deleting votes for options E and F...')
    const { error: votesError } = await supabase
      .from('votes')
      .delete()
      .in('optionId', optionIds)

    if (votesError) throw votesError
    console.log('✓ Votes deleted')

    // Delete rankings that reference these options
    console.log('\n2. Deleting rankings for options E and F...')
    const { error: rankingsError } = await supabase
      .from('rankings')
      .delete()
      .or(`firstOptionId.in.(${optionIds.join(',')}),secondOptionId.in.(${optionIds.join(',')})`)

    if (rankingsError) {
      console.log('Note: Rankings deletion error (table may not exist):', rankingsError.message)
    } else {
      console.log('✓ Rankings deleted')
    }

    // Delete the options themselves
    console.log('\n3. Deleting options E and F...')
    const { error: deleteError } = await supabase
      .from('options')
      .delete()
      .in('code', ['E', 'F'])

    if (deleteError) throw deleteError
    console.log('✓ Options deleted')

    // Verify deletion
    console.log('\n4. Verifying deletion...')
    const { data: remainingOptions, error: verifyError } = await supabase
      .from('options')
      .select('code, nickname')
      .order('code', { ascending: true })

    if (verifyError) throw verifyError

    console.log('\n✅ SUCCESS! Remaining options:')
    remainingOptions?.forEach(opt => console.log(`  ${opt.code}: ${opt.nickname}`))

  } catch (error) {
    console.error('\n❌ ERROR:', error)
    process.exit(1)
  }
}

deleteOptionsEandF()
