import { Suspense } from 'react';
import { MiningDashboard } from '@/components/client/mining-dashboard';
import { ErrorBoundary } from '@/components/client/error-boundary';

export default function HomePage() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">POW Mining Statistics</h1>
      <ErrorBoundary>
        <Suspense fallback={
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        }>
          <MiningDashboard />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
