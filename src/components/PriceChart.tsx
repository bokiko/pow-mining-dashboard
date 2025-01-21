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

const COIN_CONFIGS = {
  'verus-coin': {
    algorithm: 'VerusHash 2.2',
    hashrate: '54.2 TH/s',
    difficulty: '289,432.44',
    blockReward: 24,
    blocksPerDay: 1440,
  },
  'raptoreum': {
    algorithm: 'GhostRider',
    hashrate: '432.1 MH/s',
    difficulty: '13,432.77',
    blockReward: 100,
    blocksPerDay: 2880,
  },
  'alephium': {
    algorithm: 'Blake3',
    hashrate: '89.4 TH/s',
    difficulty: '156,744.33',
    blockReward: 2.5,
    blocksPerDay: 1440,
  }
};

export default function Home() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${Object.keys(COIN_CONFIGS).join(',')}&order=market_cap_desc&sparkline=false`
        );
        const data = await response.json();

        const formattedCoins = data.map((coin: any) => ({
          id: coin.id,
          name: coin.name,
          algorithm: COIN_CONFIGS[coin.id].algorithm,
          hashrate: COIN_CONFIGS[coin.id].hashrate,
          difficulty: COIN_CONFIGS[coin.id].difficulty,
          price: coin.current_price,
          change24h: `${coin.price_change_percentage_24h?.toFixed(1)}%`,
          blockReward: COIN_CONFIGS[coin.id].blockReward,
          blocksPerDay: COIN_CONFIGS[coin.id].blocksPerDay,
        }));

        setCoins(formattedCoins);
      } catch (error) {
        console.error('Error fetching coin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">POW Mining Dashboard</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl">Loading coin data...</div>
          </div>
        ) : (
          <>
            <CoinsTable coins={coins} />
            <div className="mt-8 text-gray-400 text-sm">
              * Click on any coin to view detailed mining statistics and setup guides
            </div>
          </>
        )}
      </div>
    </main>
  );
}
