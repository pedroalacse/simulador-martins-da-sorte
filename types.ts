
export type LotteryType = 'MEGA_SENA' | 'LOTOFACIL' | 'QUINA' | 'TIMEMANIA';

export interface PriceTableEntry {
  numbers: number;
  price: number;
}

export interface LotteryConfig {
  name: string;
  minNumbers: number;
  maxNumbers: number;
  rangeMax: number;
  prices: PriceTableEntry[];
  color: string;
}

export interface Game {
  id: string;
  lotteryType: LotteryType;
  numbers: number[];
  numDezenas: number;
  timestamp: number;
  cost: number;
  source?: string; // Ex: 'Gerador', 'Orçamento', 'Sonho'
}

export interface User {
  email: string;
  name?: string;
}
