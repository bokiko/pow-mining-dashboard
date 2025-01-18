import { NextResponse } from 'next/server';

const COIN_APIS = {
  bitcoin: 'https://api.blockchain.info/stats',
  ethereum: 'https://api.etherscan.io/api?module=proxy&action=eth_blockNumber',
  // Add more API endpoints as needed
};

async function fetchWithTimeout(url: string, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      next: { revalidate: 60 }, // Cache for 60 seconds
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function GET() {
  try {
    // Fetch Bitcoin data
    const btcResponse = await fetchWithTimeout(COIN_APIS.bitcoin);
    const btcData = await btcResponse.json();

    // Sample data structure - replace with actual API data
    const miningStats = [
      {
        coin: 'Bitcoin',
        symbol: 'BTC',
        algorithm: 'SHA-256',
        price: btcData.market_price_usd,
        netHashrate: btcData.hash_rate,
        difficulty: btcData.difficulty,
        blockReward: 6.25,
        blockTime: btcData.minutes_between_blocks * 60,
        blocksPerDay: Math.floor(86400 / (btcData.minutes_between_blocks * 60)),
        dailyEmission: 6.25 * Math.floor(86400 / (btcData.minutes_between_blocks * 60)),
      },
      // Add more coins with their respective API calls
    ];

    return NextResponse.json(miningStats);
  } catch (error) {
    console.error('Error fetching mining stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mining statistics' },
      { status: 500 }
    );
  }
}
