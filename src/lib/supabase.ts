import { createClient } from '@supabase/supabase-js'
import type { CottageOption, Vote, Room } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      rooms: {
        Row: Room
        Insert: Omit<Room, 'id' | 'createdAt'>
        Update: Partial<Omit<Room, 'id' | 'createdAt'>>
      }
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
    }
  }
}

// Rooms API
export const DEFAULT_ROOM_ID = '00000000-0000-0000-0000-000000000001'
export const DEFAULT_JOIN_CODE = 'cottage2026'

export interface CreateRoomInput {
  name: string
  joinCode: string
}

// Generate a random join code (6-8 chars, uppercase, no confusing chars like O, 0, I, 1, etc.)
export function generateJoinCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // No O, 0, I, 1
  const length = Math.floor(Math.random() * 3) + 6 // 6-8 chars
  let code = ''
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function getRoomByJoinCode(joinCode: string) {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('join_code', joinCode)
    .single()

  if (error) throw error
  return data as Room
}

export async function getDefaultRoom() {
  return getRoomByJoinCode(DEFAULT_JOIN_CODE)
}

export async function createRoom(room: CreateRoomInput) {
  const { name, joinCode } = room

  const { data, error } = await supabase
    .from('rooms')
    .insert({ name, join_code: joinCode })
    .select()
    .single()

  if (error) {
    // Log the full error details
    console.error('Supabase error creating room:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })
    throw error
  }

  console.log('Room created successfully:', data)
  return data as Room
}

// Options API
export async function getOptions(roomId: string) {
  const { data, error } = await supabase
    .from('options')
    .select('*')
    .eq('roomId', roomId)
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
export async function getVotes(roomId: string) {
  const { data, error } = await supabase
    .from('votes')
    .select('*')
    .eq('roomId', roomId)
    .order('createdAt', { ascending: false })

  if (error) throw error
  return data as Vote[]
}

export async function getUserVote(roomId: string, voterName: string, optionId: string) {
  const { data, error } = await supabase
    .from('votes')
    .select('*')
    .eq('roomId', roomId)
    .eq('voterName', voterName)
    .eq('optionId', optionId)
    .maybeSingle()

  if (error) throw error
  return data as Vote | null
}

export async function upsertVote(vote: Database['public']['Tables']['votes']['Insert']) {
  // Check if vote exists
  const existing = await getUserVote(vote.roomId, vote.voterName, vote.optionId)

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

export async function deleteAllVotes(roomId: string) {
  const { error } = await supabase
    .from('votes')
    .delete()
    .eq('roomId', roomId)
    .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all in room

  if (error) throw error
}
