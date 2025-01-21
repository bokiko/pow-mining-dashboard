'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

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

interface CoinsTableProps {
  coins: CoinData[];
}

export default function CoinsTable({ coins }: CoinsTableProps) {
  const router = useRouter();

  const calculateDailyEmissions = (coin: CoinData) => {
    const dailyCoins = coin.blockReward * coin.blocksPerDay;
    return (dailyCoins * coin.price).toLocaleString(undefined, { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    });
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
              <td className="p-4">${coin.price.toFixed(4)}</td>
              <td className="p-4">{coin.change24h}</td>
              <td className="p-4">{coin.blockReward} {coin.id.toUpperCase()}</td>
              <td className="p-4">{calculateDailyEmissions(coin)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
