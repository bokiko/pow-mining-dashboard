export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">POW Mining Dashboard</h1>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Active Coins</h2>
            <p className="text-3xl">0</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Total Hashrate</h2>
            <p className="text-3xl">0 H/s</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Active Miners</h2>
            <p className="text-3xl">0</p>
          </div>
        </div>

        {/* Coming Soon Message */}
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Dashboard Coming Soon</h2>
          <p className="text-gray-400">
            We're building a comprehensive mining dashboard. Check back soon!
          </p>
        </div>
      </div>
    </main>
  );
}
