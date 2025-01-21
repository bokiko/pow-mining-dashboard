'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Globe, Twitter, Github, Discord } from 'lucide-react';

// Add logo support and additional links
const COIN_METADATA = {
  'verus-coin': {
    logo: 'https://raw.githubusercontent.com/VerusCoin/verus.io/master/src/assets/img/verus-logo.svg',
    website: 'https://verus.io',
    twitter: 'https://twitter.com/veruscoin',
    github: 'https://github.com/VerusCoin',
    discord: 'https://discord.gg/veruscoin',
    description: 'Verus is a zero-knowledge privacy-preserving blockchain platform with strong decentralization through innovative Proof-of-Power consensus.',
    launch_date: '2018-05-21',
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
    ]
  }
};

// ... (keep existing interfaces and VERUS_CONFIG)

export default function CoinProfile() {
  const router = useRouter();
  const params = useParams();
  const coinId = params.coinId as string;
  
  // ... (keep existing state and data fetching logic)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation Bar */}
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

      {loading ? (
        <div className="p-8">
          <div className="max-w-7xl mx-auto flex justify-center items-center h-64">
            <div className="text-xl">Loading coin data...</div>
          </div>
        </div>
      ) : error || !data ? (
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-red-400">{error || 'Failed to load coin data'}</div>
          </div>
        </div>
      ) : (
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Coin Header */}
            <div className="flex items-start gap-6 mb-8">
              <img 
                src={COIN_METADATA[coinId]?.logo} 
                alt={`${data.name} logo`}
                className="w-16 h-16"
              />
              <div>
                <div className="flex items-center gap-4">
                  <h1 className="text-4xl font-bold">{data.name}</h1>
                  <span className="text-2xl text-gray-400">{data.symbol}</span>
                </div>
                <p className="text-gray-400 mt-2">
                  {COIN_METADATA[coinId]?.description}
                </p>
                <div className="flex gap-4 mt-4">
                  {COIN_METADATA[coinId]?.website && (
                    <a 
                      href={COIN_METADATA[coinId].website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                    >
                      <Globe className="w-5 h-5" />
                    </a>
                  )}
                  {COIN_METADATA[coinId]?.twitter && (
                    <a 
                      href={COIN_METADATA[coinId].twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {COIN_METADATA[coinId]?.github && (
                    <a 
                      href={COIN_METADATA[coinId].github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {COIN_METADATA[coinId]?.discord && (
                    <a 
                      href={COIN_METADATA[coinId].discord}
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

            {/* Keep existing Market Information and Mining Information grids */}
            
            {/* Add Resources Section */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {COIN_METADATA[coinId]?.resources.map((resource) => (
                  
                    key={resource.title}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <span>{resource.title}</span>
                    <Arrow className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Keep existing Mining Pools section */}

            {/* Last Updated Info */}
            <div className="text-sm text-gray-400 flex items-center justify-between">
              <span>Last updated: {new Date(data.last_updated).toLocaleString()}</span>
              <span>Launch Date: {COIN_METADATA[coinId]?.launch_date}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
