import CoinsTable from '@/components/CoinsTable';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">POW Mining Dashboard</h1>
        
        <CoinsTable />

        <div className="mt-8 text-gray-400 text-sm">
          * Click on any coin to view detailed mining statistics and setup guides
        </div>
      </div>
    </main>
  );
}
