import { MiningStats } from '@/types/mining'

const API_ENDPOINTS = {
  BITCOIN: '/api/bitcoin',
  ETHEREUM: 'https://api.etherscan.io/api',
  LITECOIN: 'https://api.litecoin.org',
  // Add more endpoints as needed
}

export class MiningAPIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message)
    this.name = 'MiningAPIError'
  }
}

async function fetchWithTimeout(url: string, timeout = 5000): Promise<Response> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    clearTimeout(id)
    return response
  } catch (error) {
    clearTimeout(id)
    throw error
  }
}

export async function fetchBitcoinStats(): Promise<MiningStats> {
  try {
    const response = await fetchWithTimeout(API_ENDPOINTS.BITCOIN)
    if (!response.ok) {
      throw new MiningAPIError(`HTTP error! status: ${response.status}`, response.status)
    }
    const data = await response.json()
    
    return {
      coin: 'Bitcoin',
      symbol: 'BTC',
      algorithm: 'SHA-256',
      price: data.market_price_usd,
      netHashrate: data.hash_rate,
      difficulty: data.difficulty,
      blockReward: 6.25,
      blockTime: data.minutes_between_blocks * 60,
      blocksPerDay: Math.floor(86400 / (data.minutes_between_blocks * 60)),
      dailyEmission: 6.25 * Math.floor(86400 / (data.minutes_between_blocks * 60)),
      lastUpdated: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error fetching Bitcoin stats:', error)
    throw new MiningAPIError(error instanceof Error ? error.message : 'Unknown error')
  }
}

// Add more coin fetching functions following the same pattern

export async function fetchAllMiningStats(): Promise<MiningStats[]> {
  try {
    const results = await Promise.allSettled([
      fetchBitcoinStats(),
      // Add more coin fetching functions here
    ])
    
    return results
      .filter((result): result is PromiseFulfilledResult<MiningStats> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value)
  } catch (error) {
    console.error('Error fetching all mining stats:', error)
    throw new MiningAPIError('Failed to fetch mining statistics')
  }
}
