import { Suspense } from 'react'
import MiningDashboard from '@/components/dashboard/MiningDashboard'

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">POW Mining Statistics</h1>
      <Suspense fallback={<div>Loading dashboard...</div>}>
        <MiningDashboard />
      </Suspense>
    </main>
  )
}
