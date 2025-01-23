'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

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

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const coinId = params.coinId as string;
  const [data, setData] = useState<CoinData | null>(null);
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

        setData({
          name: cgData.name,
          symbol: cgData.symbol.toUpperCase(),
          price: cgData.market_data.current_price.usd,
          volume_24h: cgData.market_data.total_volume.usd,
          market_cap: cgData.market_data.market_cap.usd,
          circulating_supply: cgData.market_data.circulating_supply,
          max_supply: cgData.market_data.max_supply,
          price_change_24h: cgData.market_data.price_change_percentage_24h,
          last_updated: cgData.market_data.last_updated
        });
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load coin data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Fetch every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [coinId]);

  if (loading) {
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
        <div className="flex justify-center items-center h-[80vh]">
          <div className="text-xl">Loading coin data...</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
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
            <div className="text-red-400 text-xl">{error || 'Failed to load coin data'}</div>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center gap-4 mb-8">
            <h1 className="text-4xl font-bold">{data.name}</h1>
            <span className="text-2xl text-gray-400">{data.symbol}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              </div>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-400">
            Last updated: {new Date(data.last_updated).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
