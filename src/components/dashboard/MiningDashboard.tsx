'use client'
// ☝️ This directive is required as we're using hooks and browser APIs

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchAllMiningStats } from '@/services/mining-api'
import { formatHashrate, formatDifficulty, formatPrice } from '@/utils/formatting'
import { RefreshCw } from 'lucide-react'

export default function MiningDashboard() {
  const { data: miningStats, isLoading, isError, refetch } = useQuery({
    queryKey: ['miningStats'],
    queryFn: fetchAllMiningStats,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-red-500 p-4 text-center">
        Error loading mining statistics. Please try again later.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Coin
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Algorithm
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Network Hashrate
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Difficulty
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Block Reward
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Daily Emission
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {miningStats?.map((coin) => (
            <tr key={coin.symbol}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-sm font-medium text-gray-900">
                    {coin.coin}
                  </div>
                  <div className="ml-2 text-sm text-gray-500">{coin.symbol}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {coin.algorithm}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatPrice(coin.price)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatHashrate(coin.netHashrate)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDifficulty(coin.difficulty)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {coin.blockReward}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {coin.dailyEmission.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
