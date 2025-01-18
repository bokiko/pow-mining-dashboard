'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchAllMiningStats } from '@/services/mining-api';
import { formatHashrate, formatDifficulty, formatPrice } from '@/utils/formatting';
import { RefreshCw } from 'lucide-react';

export function MiningDashboard() {
  const { data: miningStats, isLoading, isError, refetch } = useQuery({
    queryKey: ['miningStats'],
    queryFn: fetchAllMiningStats,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 p-4 text-center">
        Error loading mining statistics. Please try again later.
      </div>
    );
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
      {/* Rest of your table code */}
    </div>
  );
}
