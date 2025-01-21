'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface CoinData {
  // Market Data
  name: string;
  symbol: string;
  price: number;
  volume_24h: number;
  market_cap: number;
  circulating_supply: number;
  max_supply: number;
  price_change_24h: number;
  last_updated: string;

  // Mining Data
  algorithm: string;
  network_hashrate: string;
  difficulty: string;
  block_reward: number;
  block_time: number;
  blocks_per_day: number;

  // Mining Pools
  pools: {
    name: string;
    hashrate: string;
    miners: number;
    fee: string;
    minimum_payout: string;
  }[];
}

// Static mining configuration - will be replaced with API data where possible
const VERUS_CONFIG = {
  algorithm: 'VerusHash 2.2',
  block_reward: 24,
  block_time: 60,
  pools: [
    {
      name: 'Luckpool',
      hashrate: '12.4 TH/s',
      miners: 342,
      fee: '0.5%',
      minimum_payout: '10 VRSC'
    },
    {
      name: 'HellsPool',
      hashrate: '8.7 TH/s',
      miners: 256,
      fee: '1%',
      minimum_payout: '5 VRSC'
    }
  ]
};

export default function CoinProfile() {
  const params = useParams();
  const [data, setData] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        // Fetch CoinGecko data
        const cgResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/verus-coin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
        );

        if (!cgResponse.ok) throw new Error('Failed to fetch coin data');
        const cgData = await cgResponse.json();

        setData({
          name: cgData.name,
          symbol: cgData.symbol.toUpperCase(),
          price: cgData.market_data.current_price.usd,
          volume_24h: cgData.market_data.total_volume.usd,
          market_cap: cgData.market_data.market_cap.usd,
          circulating_supply: cgData.market_data.circulating_supply,
          max_supply: cgData.market_data.max_supply,
          price_change_24h: cgData.market_data.price_change_percentage_24h,
          last_updated: cgData.market_data.last_updated,

          // Mining Data (static for now)
          algorithm: VERUS_CONFIG.algorithm,
          network_hashrate: '54.2 TH/s', // Will be replaced with API data
          difficulty: '289,432.44', // Will be replaced with API data
          block_reward: VERUS_CONFIG.block_reward,
          block_time: VERUS_CONFIG.block_time,
          blocks_per_day: Math.floor(86400 / VERUS_CONFIG.block_time),
          
          pools: VERUS_CONFIG.pools
        });
      } catch (err) {
        console.error('Error fetching coin data:', err);
        setError('Failed to load coin data');
      } finally {
        setLoading(false);
      }
    };

    fetchCoinData();
    // Fetch every 60 seconds
    const interval = setInterval(fetchCoinData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto flex justify-center items-center h-64">
          <div className="text-xl">Loading coin data...</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-red-400">{error || 'Failed to load coin data'}</div>
        </div>
      </div>
    );
  }

  const calculateDailyEmissions = () => {
    const dailyCoins = data.block_reward * data.blocks_per_day;
    const dailyUSD = dailyCoins * data.price;
    return {
      coins: dailyCoins.toLocaleString(),
      usd: dailyUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
    };
  };

  const emissions = calculateDailyEmissions();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold">{data.name}</h1>
          <span className="text-2xl text-gray-400">{data.symbol}</span>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Market Information */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Market Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Price:</span>
                <span className="font-medium">
                  ${data.price.toFixed(8)}
                  <span className={`ml-2 ${data.price_change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {data.price_change_24h.toFixed(2)}%
                  </span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Volume (24h):</span>
                <span className="font-medium">${data.volume_24h.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Market Cap:</span>
                <span className="font-medium">${data.market_cap.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Circulating Supply:</span>
                <span className="font-medium">{data.circulating_supply.toLocaleString()} {data.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Max Supply:</span>
                <span className="font-medium">{data.max_supply.toLocaleString()} {data.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Circ. Supply / Max Supply:</span>
                <span className="font-medium">
                  {((data.circulating_supply / data.max_supply) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Mining Information */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Mining Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Algorithm:</span>
                <span className="font-medium">{data.algorithm}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Net Hashrate:</span>
                <span className="font-medium">{data.network_hashrate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Difficulty:</span>
                <span className="font-medium">{data.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Block Reward:</span>
                <span className="font-medium">{data.block_reward} {data.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Block Time:</span>
                <span className="font-medium">{data.block_time} seconds</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Blocks per Day:</span>
                <span className="font-medium">{data.blocks_per_day}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Coins Mined per Day:</span>
                <span className="font-medium">{emissions.coins} {data.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Daily Emissions:</span>
                <span className="font-medium">{emissions.usd}</span>
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
                  <th className="p-4">Fee</th>
                  <th className="p-4">Minimum Payout</th>
                  <th className="p-4">Network Share</th>
                </tr>
              </thead>
              <tbody>
                {data.pools.map((pool) => (
                  <tr key={pool.name} className="border-b border-gray-700">
                    <td className="p-4">{pool.name}</td>
                    <td className="p-4">{pool.hashrate}</td>
                    <td className="p-4">{pool.miners}</td>
                    <td className="p-4">{pool.fee}</td>
                    <td className="p-4">{pool.minimum_payout}</td>
                    <td className="p-4">
                      {((parseInt(pool.hashrate) / parseInt(data.network_hashrate)) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-sm text-gray-400">
          Last updated: {new Date(data.last_updated).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
