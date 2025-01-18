export interface MiningStats {
  coin: string
  symbol: string
  algorithm: string
  price: number
  netHashrate: number
  difficulty: number
  blockReward: number
  blockTime: number
  blocksPerDay: number
  dailyEmission: number
  lastUpdated: string
}

export interface CoinAPIResponse {
  success: boolean
  message?: string
  data?: any
}

export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  key: keyof MiningStats
  direction: SortDirection
}

export type HashrateSizes = 'H/s' | 'KH/s' | 'MH/s' | 'GH/s' | 'TH/s' | 'PH/s' | 'EH/s'
