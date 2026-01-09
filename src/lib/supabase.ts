import { createClient } from '@supabase/supabase-js'
import type { CottageOption, Vote, Ranking } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
