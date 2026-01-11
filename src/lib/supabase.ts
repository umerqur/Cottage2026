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

export async function getRoomById(roomId: string) {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', roomId)
    .single()

  if (error) throw error
  return data as Room
}

export async function createRoom(room: Database['public']['Tables']['rooms']['Insert']) {
  const { name, joinCode, adminName } = room

  const { data, error } = await supabase
    .from('rooms')
    .insert({ name, join_code: joinCode, admin_name: adminName })
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
    .eq('room_id', roomId)
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
  // Convert camelCase to snake_case for Supabase
  const { data, error } = await supabase
    .from('options')
    .insert({
      room_id: option.roomId,
      code: option.code,
      nickname: option.nickname,
      title: option.title,
      location: option.location,
      price_night: option.priceNight,
      total_estimate: option.totalEstimate,
      guests: option.guests,
      beds: option.beds,
      baths: option.baths,
      perks: option.perks,
      airbnb_url: option.airbnbUrl,
      image_urls: option.imageUrls,
      notes: option.notes,
    })
    .select()
    .single()

  if (error) throw error
  return data as CottageOption
}

export async function updateOption(id: string, option: Database['public']['Tables']['options']['Update']) {
  // Convert camelCase to snake_case for Supabase
  const updatePayload: Record<string, any> = {}
  if (option.nickname !== undefined) updatePayload.nickname = option.nickname
  if (option.title !== undefined) updatePayload.title = option.title
  if (option.location !== undefined) updatePayload.location = option.location
  if (option.priceNight !== undefined) updatePayload.price_night = option.priceNight
  if (option.totalEstimate !== undefined) updatePayload.total_estimate = option.totalEstimate
  if (option.guests !== undefined) updatePayload.guests = option.guests
  if (option.beds !== undefined) updatePayload.beds = option.beds
  if (option.baths !== undefined) updatePayload.baths = option.baths
  if (option.perks !== undefined) updatePayload.perks = option.perks
  if (option.airbnbUrl !== undefined) updatePayload.airbnb_url = option.airbnbUrl
  if (option.imageUrls !== undefined) updatePayload.image_urls = option.imageUrls
  if (option.notes !== undefined) updatePayload.notes = option.notes

  const { data, error } = await supabase
    .from('options')
    .update(updatePayload)
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
    .eq('room_id', roomId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Vote[]
}

export async function getUserVote(roomId: string, voterName: string, optionId: string) {
  const { data, error } = await supabase
    .from('votes')
    .select('*')
    .eq('room_id', roomId)
    .eq('voter_name', voterName)
    .eq('option_id', optionId)
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
      .update({ vote_value: vote.voteValue })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw error
    return data as Vote
  } else {
    // Create new vote - convert camelCase to snake_case
    const { data, error } = await supabase
      .from('votes')
      .insert({
        room_id: vote.roomId,
        voter_name: vote.voterName,
        option_id: vote.optionId,
        vote_value: vote.voteValue,
      })
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
    .eq('room_id', roomId)
    .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all in room

  if (error) throw error
}

// Storage API
export async function uploadOptionImage(file: File, roomId: string): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${roomId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `option-images/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('cottage-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('cottage-images')
    .getPublicUrl(filePath)

  return publicUrl
}
