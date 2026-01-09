import { createClient } from '@supabase/supabase-js'
import type { CottageOption, Vote, Ranking } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Only create client if both values exist
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any // Will never be used when not configured

// Database types
export interface Database {
  public: {
    Tables: {
      options: {
        Row: CottageOption
        Insert: Omit<CottageOption, 'id' | 'createdAt'>
        Update: Partial<Omit<CottageOption, 'id' | 'createdAt'>>
      }
      votes: {
        Row: Vote
        Insert: Omit<Vote, 'id' | 'createdAt'>
        Update: Partial<Omit<Vote, 'id' | 'createdAt'>>
      }
      rankings: {
        Row: Ranking
        Insert: Omit<Ranking, 'id' | 'createdAt'>
        Update: Partial<Omit<Ranking, 'id' | 'createdAt'>>
      }
    }
  }
}

// Options API
export async function getOptions() {
  const { data, error } = await supabase
    .from('options')
    .select('*')
    .order('code', { ascending: true })

  if (error) throw error
  return data as CottageOption[]
}

export async function getOption(id: string) {
  const { data, error } = await supabase
    .from('options')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as CottageOption
}

export async function createOption(option: Database['public']['Tables']['options']['Insert']) {
  const { data, error } = await supabase
    .from('options')
    .insert(option)
    .select()
    .single()

  if (error) throw error
  return data as CottageOption
}

export async function updateOption(id: string, option: Database['public']['Tables']['options']['Update']) {
  const { data, error } = await supabase
    .from('options')
    .update(option)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as CottageOption
}

// Votes API
export async function getVotes() {
  const { data, error } = await supabase
    .from('votes')
    .select('*')
    .order('createdAt', { ascending: false })

  if (error) throw error
  return data as Vote[]
}

export async function getUserVote(voterName: string, optionId: string) {
  const { data, error } = await supabase
    .from('votes')
    .select('*')
    .eq('voterName', voterName)
    .eq('optionId', optionId)
    .maybeSingle()

  if (error) throw error
  return data as Vote | null
}

export async function upsertVote(vote: Database['public']['Tables']['votes']['Insert']) {
  // Check if vote exists
  const existing = await getUserVote(vote.voterName, vote.optionId)

  if (existing) {
    // Update existing vote
    const { data, error } = await supabase
      .from('votes')
      .update({ voteValue: vote.voteValue })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw error
    return data as Vote
  } else {
    // Create new vote
    const { data, error } = await supabase
      .from('votes')
      .insert(vote)
      .select()
      .single()

    if (error) throw error
    return data as Vote
  }
}

export async function deleteAllVotes() {
  const { error } = await supabase
    .from('votes')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

  if (error) throw error
}

// Rankings API
export async function getRankings() {
  const { data, error } = await supabase
    .from('rankings')
    .select('*')
    .order('createdAt', { ascending: false })

  if (error) throw error
  return data as Ranking[]
}

export async function getUserRanking(voterName: string) {
  const { data, error } = await supabase
    .from('rankings')
    .select('*')
    .eq('voterName', voterName)
    .maybeSingle()

  if (error) throw error
  return data as Ranking | null
}

export async function upsertRanking(ranking: Database['public']['Tables']['rankings']['Insert']) {
  // Check if ranking exists
  const existing = await getUserRanking(ranking.voterName)

  if (existing) {
    // Update existing ranking
    const { data, error } = await supabase
      .from('rankings')
      .update({
        firstOptionId: ranking.firstOptionId,
        secondOptionId: ranking.secondOptionId,
      })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw error
    return data as Ranking
  } else {
    // Create new ranking
    const { data, error } = await supabase
      .from('rankings')
      .insert(ranking)
      .select()
      .single()

    if (error) throw error
    return data as Ranking
  }
}

export async function deleteAllRankings() {
  const { error } = await supabase
    .from('rankings')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

  if (error) throw error
}

// Seed default options
export async function seedDefaultOptions() {
  const defaultOptions = [
    {
      code: 'A',
      nickname: 'Option A',
      title: 'Cottage Option A',
      location: 'Ontario, Canada',
      priceNight: 400,
      totalEstimate: 1600,
      guests: 8,
      beds: 4,
      baths: 2.0,
      perks: ['Lake access', 'Fire pit', 'BBQ'],
      airbnbUrl: 'https://airbnb.com',
      imageUrls: ['/options/A.jpg'],
      notes: 'Placeholder option A - edit via admin panel',
    },
    {
      code: 'B',
      nickname: 'Option B',
      title: 'Cottage Option B',
      location: 'Ontario, Canada',
      priceNight: 400,
      totalEstimate: 1600,
      guests: 8,
      beds: 4,
      baths: 2.0,
      perks: ['Lake access', 'Fire pit', 'BBQ'],
      airbnbUrl: 'https://airbnb.com',
      imageUrls: ['/options/B.jpg'],
      notes: 'Placeholder option B - edit via admin panel',
    },
    {
      code: 'C',
      nickname: 'Option C',
      title: 'Cottage Option C',
      location: 'Ontario, Canada',
      priceNight: 400,
      totalEstimate: 1600,
      guests: 8,
      beds: 4,
      baths: 2.0,
      perks: ['Lake access', 'Fire pit', 'BBQ'],
      airbnbUrl: 'https://airbnb.com',
      imageUrls: ['/options/C.jpg'],
      notes: 'Placeholder option C - edit via admin panel',
    },
    {
      code: 'D',
      nickname: 'Option D',
      title: 'Cottage Option D',
      location: 'Ontario, Canada',
      priceNight: 400,
      totalEstimate: 1600,
      guests: 8,
      beds: 4,
      baths: 2.0,
      perks: ['Lake access', 'Fire pit', 'BBQ'],
      airbnbUrl: 'https://airbnb.com',
      imageUrls: ['/options/D.jpg'],
      notes: 'Placeholder option D - edit via admin panel',
    },
    {
      code: 'E',
      nickname: 'Option E',
      title: 'Cottage Option E',
      location: 'Ontario, Canada',
      priceNight: 400,
      totalEstimate: 1600,
      guests: 8,
      beds: 4,
      baths: 2.0,
      perks: ['Lake access', 'Fire pit', 'BBQ'],
      airbnbUrl: 'https://airbnb.com',
      imageUrls: ['/options/E.jpg'],
      notes: 'Placeholder option E - edit via admin panel',
    },
    {
      code: 'F',
      nickname: 'Option F',
      title: 'Cottage Option F',
      location: 'Ontario, Canada',
      priceNight: 400,
      totalEstimate: 1600,
      guests: 8,
      beds: 4,
      baths: 2.0,
      perks: ['Lake access', 'Fire pit', 'BBQ'],
      airbnbUrl: 'https://airbnb.com',
      imageUrls: ['/options/F.jpg'],
      notes: 'Placeholder option F - edit via admin panel',
    },
  ]

  const results = []
  for (const option of defaultOptions) {
    try {
      // Try to insert, but ignore if it already exists (code is unique)
      const { data, error } = await supabase
        .from('options')
        .insert(option)
        .select()
        .single()

      if (error && error.code !== '23505') { // 23505 is duplicate key error
        throw error
      }

      if (data) {
        results.push(data)
      }
    } catch (err) {
      // Ignore duplicate key errors, but log others
      console.error('Error seeding option:', option.code, err)
    }
  }

  return results
}
