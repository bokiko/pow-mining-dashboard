import { HashrateSizes } from '@/types/mining'

export function formatHashrate(hashrate: number): string {
  const units: HashrateSizes[] = ['H/s', 'KH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s', 'EH/s']
  let unitIndex = 0
  
  while (hashrate >= 1000 && unitIndex < units.length - 1) {
    hashrate /= 1000
    unitIndex++
  }
  
  return `${hashrate.toFixed(2)} ${units[unitIndex]}`
}

export function formatDifficulty(difficulty: number): string {
  return difficulty.toExponential(2)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  }).format(price)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

export function calculateMiningReward(
  hashrate: number,
  networkHashrate: number,
  blockReward: number,
  blocksPerDay: number
): number {
  const shareOfNetwork = hashrate / networkHashrate
  return shareOfNetwork * blockReward * blocksPerDay
}
