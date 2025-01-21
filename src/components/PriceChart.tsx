'use client';

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PriceChartProps {
  coinId: string;
  symbol: string;
}

export default function PriceChart({ coinId, symbol }: PriceChartProps) {
  const [priceData, setPriceData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        // CoinGecko API - 7 days of hourly data
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7&interval=hourly`
        );
        const data = await response.json();
        
        // Transform the data into the format our chart needs
        const formattedData = data.prices.map(([timestamp, price]: [number, number]) => ({
          date: new Date(timestamp).toLocaleDateString(),
          price: price,
          volume: 0 // We can add volume data if needed
        }));
        
        setPriceData(formattedData);
      } catch (error) {
        console.error('Error fetching price data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPriceHistory();
  }, [coinId]);

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Price Chart</h2>
        <div className="h-[400px] flex items-center justify-center">
          <span>Loading price data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Price Chart</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={priceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
              domain={['auto', 'auto']}
              tickFormatter={(value) => `$${value.toFixed(4)}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '0.5rem'
              }}
              labelStyle={{ color: '#9CA3AF' }}
              formatter={(value) => [`$${Number(value).toFixed(8)}`, 'Price']}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#10B981" 
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
