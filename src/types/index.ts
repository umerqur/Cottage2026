export type VoteValue = 'yes' | 'maybe' | 'no'

export interface CottageOption {
  id: string
  code: string
  nickname: string
  title: string
  location: string
  priceNight: number
  totalEstimate: number
  guests: number
  beds: number
  baths: number
  perks: string[]
  airbnbUrl: string
  imageUrls: string[]
  notes?: string
  createdAt: string
}

export interface Vote {
  id: string
  voterName: string
  optionId: string
  voteValue: VoteValue
  createdAt: string
}

export interface VoteSummary {
  optionId: string
  yes: number
  maybe: number
  no: number
  voters: {
    name: string
    vote: VoteValue
  }[]
}
