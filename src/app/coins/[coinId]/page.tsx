'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Globe, Twitter, Github, Discord } from 'lucide-react';

interface CoinData {
  name: string;
  symbol: string;
  price: number;
  volume_24h: number;
  market_cap: number;
  circulating_supply: number;
  max_supply: number;
  price_change_24h: number;
  last_updated: string;
}

interface MiningData {
  algorithm: string;
  network_hashrate: string;
  difficulty: string;
  block_reward: number;
  block_time: number;
  blocks_per_day: number;
  pools: {
    name: string;
    hashrate: string;
    miners: number;
    fee: string;
    minimum_payout: string;
  }[];
}

const COIN_METADATA = {
  'verus-coin': {
    logo: 'https://raw.githubusercontent.com/VerusCoin/verus.io/master/src/assets/img/verus-logo.svg',
    website: 'https://verus.io',
    twitter: 'https://twitter.com/veruscoin',
    github: 'https://github.com/VerusCoin',
    discord: 'https://discord.gg/veruscoin',
    description: 'Verus is a zero-knowledge privacy-preserving blockchain platform with strong decentralization through innovative Proof-of-Power consensus.',
    launch_date: '2018-05-21',
    algorithm: 'VerusHash 2.2',
    block_reward: 24,
    block_time: 60,
    resources: [
      {
        title: 'Mining Guide',
        url: 'https://docs.verus.io/mining-and-staking/start-mining'
      },
      {
        title: 'Mining Calculator',
        url: 'https://minerstat.com/coin/VRSC'
      },
      {
        title: 'Block Explorer',
        url: 'https://explorer.verus.io'
      }
    ],
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
  }
} as const;

export default function CoinProfile() {
  const router = useRouter();
  const params = useParams();
  const coinId = params.coinId as string;
  const [data, setData] = useState<(CoinData & MiningData) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
        );

        if (!response.ok) throw new Error('Failed to fetch coin data');
        const cgData = await response.json();

        if (!COIN_METADATA[coinId as keyof typeof COIN_METADATA]) {
          throw new Error('Coin not supported');
        }

        const coinMeta = COIN_METADATA[coinId as keyof typeof COIN_METADATA];

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
          algorithm: coinMeta.algorithm,
          network_hashrate: '54.2 TH/s', // To be replaced with actual API data
          difficulty: '289,432.44', // To be replaced with actual API data
          block_reward: coinMeta.block_reward,
          block_time: coinMeta.block_time,
          blocks_per_day: Math.floor(86400 / coinMeta.block_time),
          pools: coinMeta.pools,
        });

        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load coin data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [coinId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="flex justify-center items-center h-screen">
          <div className="text-xl">Loading coin data...</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-red-400 text-xl">{error || 'Failed to load coin data'}</div>
        </div>
      </div>
    );
  }

  const coinMeta = COIN_METADATA[coinId as keyof typeof COIN_METADATA];
  const emissions = {
    coins: data.block_reward * data.blocks_per_day,
    usd: (data.block_reward * data.blocks_per_day * data.price).toLocaleString('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    })
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Coin Header */}
          <div className="flex items-start gap-6 mb-8">
            {coinMeta.logo && (
              <img 
                src={coinMeta.logo}
                alt={`${data.name} logo`}
                className="w-16 h-16"
              />
            )}
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-bold">{data.name}</h1>
                <span className="text-2xl text-gray-400">{data.symbol}</span>
              </div>
              <p className="text-gray-400 mt-2">{coinMeta.description}</p>
              <div className="flex gap-4 mt-4">
                {coinMeta.website && (
                  <a 
                    href={coinMeta.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white"
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                )}
                {coinMeta.twitter && (
                  <a 
                    href={coinMeta.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {coinMeta.github && (
                  <a 
                    href={coinMeta.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {coinMeta.discord && (
                  <a 
                    href={coinMeta.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white"
                  >
                    <Discord className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Market and Mining Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
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

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Mining Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Algorithm:</span>
                  <span className="font-medium">{data.algorithm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Network Hashrate:</span>
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
                  <span className="font-medium">{emissions.coins.toLocaleString()} {data.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Daily Emissions:</span>
                  <span className="font-medium">{emissions.usd}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Resources Section */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coinMeta.resources.map((resource) => (
                
                  key={resource.title}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <span>{resource.title}</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </a>
              ))}
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

          {/* Last Updated Info */}
          <div className="text-sm text-gray-400 flex items-center justify-between">
            <span>Last updated: {new Date(data.last_updated).toLocaleString()}</span>
            <span>Launch Date: {coinMeta.launch_date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
