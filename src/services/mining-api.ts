// src/services/mining-api.ts

import { MiningStats } from '@/types/mining';

// Define API endpoints for different coins
const API_ENDPOINTS = {
  // Using public APIs that don't require authentication
  BITCOIN: 'https://api.blockchain.info/stats',
  ETHEREUM: 'https://api.etherscan.io/api?module=stats&action=ethsupply',
  LITECOIN: 'https://api.blockchair.com/litecoin/stats',
  DOGECOIN: 'https://api.blockchair.com/dogecoin/stats',
  MONERO: 'https://localmonero.co/blocks/stats'
};

// Custom error class for API-specific errors
export class MiningAPIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'MiningAPIError';
  }
}

// Helper function to fetch with timeout
async function fetchWithTimeout(url: string, timeout = 5000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
      // Cache requests for 1 minute
      next: { revalidate: 60 }
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// Function to fetch Bitcoin statistics
export async function fetchBitcoinStats(): Promise<MiningStats> {
  try {
    const response = await fetchWithTimeout(API_ENDPOINTS.BITCOIN);
    if (!response.ok) {
      throw new MiningAPIError(`HTTP error! status: ${response.status}`, response.status);
    }
    const data = await response.json();
    
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
    };
  } catch (error) {
    console.error('Error fetching Bitcoin stats:', error);
    throw new MiningAPIError(error instanceof Error ? error.message : 'Unknown error');
  }
}

// Function to fetch Ethereum statistics
export async function fetchEthereumStats(): Promise<MiningStats> {
  try {
    const response = await fetchWithTimeout(API_ENDPOINTS.ETHEREUM);
    if (!response.ok) {
      throw new MiningAPIError(`HTTP error! status: ${response.status}`, response.status);
    }
    const data = await response.json();

    return {
      coin: 'Ethereum',
      symbol: 'ETH',
      algorithm: 'Ethash',
      price: data.market_price_usd || 0,
      netHashrate: data.hash_rate || 0,
      difficulty: data.difficulty || 0,
      blockReward: 2.0, // Current ETH block reward
      blockTime: 12, // Average ETH block time in seconds
      blocksPerDay: Math.floor(86400 / 12),
      dailyEmission: 2.0 * Math.floor(86400 / 12),
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching Ethereum stats:', error);
    throw new MiningAPIError(error instanceof Error ? error.message : 'Unknown error');
  }
}

// Function to fetch Litecoin statistics
export async function fetchLitecoinStats(): Promise<MiningStats> {
  try {
    const response = await fetchWithTimeout(API_ENDPOINTS.LITECOIN);
    if (!response.ok) {
      throw new MiningAPIError(`HTTP error! status: ${response.status}`, response.status);
    }
    const data = await response.json();
    
    return {
      coin: 'Litecoin',
      symbol: 'LTC',
      algorithm: 'Scrypt',
      price: data.data.market_price_usd || 0,
      netHashrate: data.data.hashrate || 0,
      difficulty: data.data.difficulty || 0,
      blockReward: 12.5,
      blockTime: 150, // LTC target block time in seconds
      blocksPerDay: Math.floor(86400 / 150),
      dailyEmission: 12.5 * Math.floor(86400 / 150),
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching Litecoin stats:', error);
    throw new MiningAPIError(error instanceof Error ? error.message : 'Unknown error');
  }
}

// Function to fetch all mining statistics
export async function fetchAllMiningStats(): Promise<MiningStats[]> {
  try {
    // Use Promise.allSettled to handle multiple API calls
    const results = await Promise.allSettled([
      fetchBitcoinStats(),
      fetchEthereumStats(),
      fetchLitecoinStats(),
      // Add more coin fetching functions here
    ]);
    
    // Log any failures for debugging
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Failed to fetch coin ${index}:`, result.reason);
      }
    });
    
    // Filter out failed requests and map to successful results
    return results
      .filter((result): result is PromiseFulfilledResult<MiningStats> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);
  } catch (error) {
    console.error('Error fetching all mining stats:', error);
    throw new MiningAPIError('Failed to fetch mining statistics');
  }
}
