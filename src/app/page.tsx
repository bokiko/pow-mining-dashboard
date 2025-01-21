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

export default function Home() {
  const [coins, setCoins] = useState<CoinData[]>([
    {
      id: 'verus-coin',
      name: 'Verus Coin',
      algorithm: 'VerusHash 2.2',
      hashrate: '54.2 TH/s',
      difficulty: '289,432.44',
      price: 0.42,
      change24h: '+2.5%',
      blockReward: 24,
      blocksPerDay: 1440
    },
    {
      id: 'raptoreum',
      name: 'Raptoreum',
      algorithm: 'GhostRider',
      hashrate: '432.1 MH/s',
      difficulty: '13,432.77',
      price: 0.0012,
      change24h: '-1.2%',
      blockReward: 100,
      blocksPerDay: 2880
    },
    {
      id: 'alephium',
      name: 'Alephium',
      algorithm: 'Blake3',
      hashrate: '89.4 TH/s',
      difficulty: '156,744.33',
      price: 1.24,
      change24h: '+5.7%',
      blockReward: 2.5,
      blocksPerDay: 1440
    }
  ]);

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">POW Mining Dashboard</h1>
        
        <CoinsTable coins={coins} />

        <div className="mt-8 text-gray-400 text-sm">
          * Click on any coin to view detailed mining statistics and setup guides
        </div>
      </div>
    </main>
  );
}
