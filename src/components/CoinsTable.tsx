'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function CoinsTable() {
  const router = useRouter();
  
  // This will be replaced with real data later
  const coins = [
    {
      id: 'verus',
      name: 'Verus Coin',
      algorithm: 'VerusHash 2.2',
      hashrate: '54.2 TH/s',
      difficulty: '289,432.44',
      price: '$0.42',
      change24h: '+2.5%',
      blockReward: '24 VRSC'
    },
    {
      id: 'rtm',
      name: 'Raptoreum',
      algorithm: 'GhostRider',
      hashrate: '432.1 MH/s',
      difficulty: '13,432.77',
      price: '$0.0012',
      change24h: '-1.2%',
      blockReward: '100 RTM'
    },
    {
      id: 'alph',
      name: 'Alephium',
      algorithm: 'Blake3',
      hashrate: '89.4 TH/s',
      difficulty: '156,744.33',
      price: '$1.24',
      change24h: '+5.7%',
      blockReward: '2.5 ALPH'
    }
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-gray-800 rounded-lg">
        <thead>
          <tr className="text-left border-b border-gray-700">
            <th className="p-4">Coin</th>
            <th className="p-4">Algorithm</th>
            <th className="p-4">Network Hashrate</th>
            <th className="p-4">Difficulty</th>
            <th className="p-4">Price</th>
            <th className="p-4">24h Change</th>
            <th className="p-4">Block Reward</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <tr 
              key={coin.id}
              className="border-b border-gray-700 hover:bg-gray-700 cursor-pointer"
              onClick={() => router.push(`/coins/${coin.id}`)}
            >
              <td className="p-4 font-medium">{coin.name}</td>
              <td className="p-4">{coin.algorithm}</td>
              <td className="p-4">{coin.hashrate}</td>
              <td className="p-4">{coin.difficulty}</td>
              <td className="p-4">{coin.price}</td>
              <td className="p-4">{coin.change24h}</td>
              <td className="p-4">{coin.blockReward}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
