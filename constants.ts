
import { LotteryConfig, LotteryType } from './types';

export const LOTTERY_CONFIGS: Record<LotteryType, LotteryConfig> = {
  MEGA_SENA: {
    name: 'Mega-Sena',
    minNumbers: 6,
    maxNumbers: 20,
    rangeMax: 60,
    color: 'bg-green-600',
    prices: [
      { numbers: 6, price: 6.00 },
      { numbers: 7, price: 42.00 },
      { numbers: 8, price: 168.00 },
      { numbers: 9, price: 504.00 },
      { numbers: 10, price: 1260.00 },
      { numbers: 11, price: 2772.00 },
      { numbers: 12, price: 5544.00 },
      { numbers: 13, price: 10296.00 },
      { numbers: 14, price: 18018.00 },
      { numbers: 15, price: 30030.00 },
      { numbers: 16, price: 48048.00 },
      { numbers: 17, price: 74256.00 },
      { numbers: 18, price: 111384.00 },
      { numbers: 19, price: 162792.00 },
      { numbers: 20, price: 232560.00 }
    ]
  },
  LOTOFACIL: {
    name: 'Lotofácil',
    minNumbers: 15,
    maxNumbers: 20,
    rangeMax: 25,
    color: 'bg-purple-600',
    prices: [
      { numbers: 15, price: 3.50 },
      { numbers: 16, price: 56.00 },
      { numbers: 17, price: 476.00 },
      { numbers: 18, price: 2856.00 },
      { numbers: 19, price: 13566.00 },
      { numbers: 20, price: 54264.00 }
    ]
  },
  QUINA: {
    name: 'Quina',
    minNumbers: 5,
    maxNumbers: 15,
    rangeMax: 80,
    color: 'bg-blue-600',
    prices: [
      { numbers: 5, price: 3.00 },
      { numbers: 6, price: 18.00 },
      { numbers: 7, price: 63.00 },
      { numbers: 8, price: 168.00 },
      { numbers: 9, price: 378.00 },
      { numbers: 10, price: 756.00 },
      { numbers: 11, price: 1386.00 },
      { numbers: 12, price: 2376.00 },
      { numbers: 13, price: 3861.00 },
      { numbers: 14, price: 6006.00 },
      { numbers: 15, price: 9009.00 }
    ]
  },
  TIMEMANIA: {
    name: 'Timemania',
    minNumbers: 10,
    maxNumbers: 10,
    rangeMax: 80,
    color: 'bg-yellow-500',
    prices: [
      { numbers: 10, price: 3.50 }
    ]
  }
};
