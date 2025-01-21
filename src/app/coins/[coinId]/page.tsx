'use client';

import React from 'react';
import { useParams } from 'next/navigation';

export default function CoinProfile() {
  const params = useParams();
  const coinId = params.coinId as string;

  // This will be replaced with real API data later
  const coinData = {
    verus: {
      name: 'Verus Coin',
      symbol: 'VRSC',
      algorithm: 'VerusHash 2.2',
      price: 0.42,
      volume_24h: '243,567',
      market_cap: '28,456,789',
      circulating_supply: '67,754,321',
      max_supply: '83,540,000',
      net_hashrate: '54.2 TH/s',
      difficulty: '289,432.44',
      block_reward: 24,
      block_time: 60, // seconds
      blocks_per_day: 1440,
      pools: [
        { name: 'Luckpool', hashrate: '12.4 TH/s', miners: 342 },
        { name: 'HellsPool', hashrate: '8.7 TH/s', miners: 256 },
      ],
    },
    // Add other coins here
  }[coinId] || null;

  if (!coinData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Coin not found</h1>
        </div>
      </div>
    );
  }

  const calculateDailyCoins = () => coinData.block_reward * coinData.blocks_per_day;
  const calculateDailyValue = () => (calculateDailyCoins() * coinData.price).toLocaleString('en-US', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 0 
  });
  const calculateCircMaxRatio = () => {
    const ratio = (Number(coinData.circulating_supply.replace(/,/g, '')) / Number(coinData.max_supply.replace(/,/g, ''))) * 100;
    return `${ratio.toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold">{coinData.name}</h1>
          <span className="text-2xl text-gray-400">{coinData.symbol}</span>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Market Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Price:</span>
                <span className="font-medium">${coinData.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Volume (24h):</span>
                <span className="font-medium">${coinData.volume_24h}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Market Cap:</span>
                <span className="font-medium">${coinData.market_cap}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Circulating Supply:</span>
                <span className="font-medium">{coinData.circulating_supply} {coinData.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Max Supply:</span>
                <span className="font-medium">{coinData.max_supply} {coinData.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Circ. Supply / Max Supply:</span>
                <span className="font-medium">{calculateCircMaxRatio()}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Mining Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Algorithm:</span>
                <span className="font-medium">{coinData.algorithm}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Net Hashrate:</span>
                <span className="font-medium">{coinData.net_hashrate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Difficulty:</span>
                <span className="font-medium">{coinData.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Block Reward:</span>
                <span className="font-medium">{coinData.block_reward} {coinData.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Block Time:</span>
                <span className="font-medium">{coinData.block_time} seconds</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Blocks per Day:</span>
                <span className="font-medium">{coinData.blocks_per_day}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Coins Mined per Day:</span>
                <span className="font-medium">{calculateDailyCoins().toLocaleString()} {coinData.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Daily Emissions:</span>
                <span className="font-medium">{calculateDailyValue()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mining Pools Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Mining Pools</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="p-4">Pool Name</th>
                  <th className="p-4">Hashrate</th>
                  <th className="p-4">Miners</th>
                  <th className="p-4">Network Share</th>
                </tr>
              </thead>
              <tbody>
                {coinData.pools.map((pool) => (
                  <tr key={pool.name} className="border-b border-gray-700">
                    <td className="p-4">{pool.name}</td>
                    <td className="p-4">{pool.hashrate}</td>
                    <td className="p-4">{pool.miners}</td>
                    <td className="p-4">
                      {((parseInt(pool.hashrate) / parseInt(coinData.net_hashrate)) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
