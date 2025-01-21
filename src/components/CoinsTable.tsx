'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function CoinsTable() {
  const router = useRouter();
  
  const coins = [
    {
      id: 'verus',
      name: 'Verus Coin',
      algorithm: 'VerusHash 2.2',
      hashrate: '54.2 TH/s',
      difficulty: '289,432.44',
      price: 0.42,
      change24h: '+2.5%',
      blockReward: 24,
      blocksPerDay: 1440, // assuming 1-minute block time
    },
    {
      id: 'rtm',
      name: 'Raptoreum',
      algorithm: 'GhostRider',
      hashrate: '432.1 MH/s',
      difficulty: '13,432.77',
      price: 0.0012,
      change24h: '-1.2%',
      blockReward: 100,
      blocksPerDay: 2880, // assuming 30-second block time
    },
    {
      id: 'alph',
      name: 'Alephium',
      algorithm: 'Blake3',
      hashrate: '89.4 TH/s',
      difficulty: '156,744.33',
      price: 1.24,
      change24h: '+5.7%',
      blockReward: 2.5,
      blocksPerDay: 1440, // assuming 1-minute block time
    }
  ];

  const calculateDailyEmissions = (coin: typeof coins[0]) => {
    const dailyCoins = coin.blockReward * coin.blocksPerDay;
    const dailyUSD = dailyCoins * coin.price;
    return {
      coins: dailyCoins.toLocaleString(undefined, { maximumFractionDigits: 0 }),
      usd: dailyUSD.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
    };
  };

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
            <th className="p-4">Daily Emissions</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => {
            const emissions = calculateDailyEmissions(coin);
            return (
              <tr 
                key={coin.id}
                className="border-b border-gray-700 hover:bg-gray-700 cursor-pointer"
                onClick={() => router.push(`/coins/${coin.id}`)}
              >
                <td className="p-4 font-medium">{coin.name}</td>
                <td className="p-4">{coin.algorithm}</td>
                <td className="p-4">{coin.hashrate}</td>
                <td className="p-4">{coin.difficulty}</td>
                <td className="p-4">${coin.price}</td>
                <td className="p-4">{coin.change24h}</td>
                <td className="p-4">{coin.blockReward} {coin.id.toUpperCase()}</td>
                <td className="p-4">
                  <div>{emissions.coins} {coin.id.toUpperCase()}</div>
                  <div className="text-gray-400 text-sm">{emissions.usd}</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
