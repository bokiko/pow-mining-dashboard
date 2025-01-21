'use client';

import { useEffect, useState } from 'react';
import CoinsTable from '@/components/CoinsTable';

interface CoinData {
  id: string;
  name: string;
  algorithm: string;
  hashrate: string;
  difficulty: string;
  price: number;
  change24h: string;
  blockReward: number;
  blocksPerDay: number;
}

// Static mining data - this won't change frequently
const COIN_CONFIGS = {
  'verus-coin': {
    algorithm: 'VerusHash 2.2',
    hashrate: '54.2 TH/s',
    difficulty: '289,432.44',
    blockReward: 24,
    blocksPerDay: 1440
  },
  'raptoreum': {
    algorithm: 'GhostRider',
    hashrate: '432.1 MH/s',
    difficulty: '13,432.77',
    blockReward: 100,
    blocksPerDay: 2880
  },
  'alephium': {
    algorithm: 'Blake3',
    hashrate: '89.4 TH/s',
    difficulty: '156,744.33',
    blockReward: 2.5,
    blocksPerDay: 1440
  }
};

export default function Home() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = async () => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${Object.keys(COIN_CONFIGS).join(',')}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch prices');
      }

      const data = await response.json();
      
      const updatedCoins = data.map((coin: any) => ({
        id: coin.id,
        name: coin.name,
        algorithm: COIN_CONFIGS[coin.id].algorithm,
        hashrate: COIN_CONFIGS[coin.id].hashrate,
        difficulty: COIN_CONFIGS[coin.id].difficulty,
        price: coin.current_price,
        change24h: `${coin.price_change_percentage_24h?.toFixed(2)}%`,
        blockReward: COIN_CONFIGS[coin.id].blockReward,
        blocksPerDay: COIN_CONFIGS[coin.id].blocksPerDay
      }));

      setCoins(updatedCoins);
      setError(null);
    } catch (err) {
      console.error('Error fetching prices:', err);
      setError('Failed to fetch latest prices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    // Fetch prices every 60 seconds
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">POW Mining Dashboard</h1>
          {error && <div className="text-red-400">{error}</div>}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-gray-800 rounded-lg">
            <div className="text-xl">Loading latest prices...</div>
          </div>
        ) : (
          <>
            <CoinsTable coins={coins} />
            <div className="mt-8 text-gray-400 text-sm">
              * Click on any coin to view detailed mining statistics and setup guides
            </div>
            <div className="mt-2 text-gray-500 text-xs">
              Prices update every 60 seconds
            </div>
          </>
        )}
      </div>
    </main>
  );
}
