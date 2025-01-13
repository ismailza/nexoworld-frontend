export interface Coin {
  id: string;
  name: string;
  icon: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface CoinLocation {
  id: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  coin: Coin;
  createdAt: Date;
  updatedAt: Date;
};
