import { User } from "./user.types";

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
  coin: Coin;
  isCaught: boolean;
  caughtBy: User | null;
  caughtAt: Date | null;
  ownedBy: User | null;
  createdAt: Date;
  updatedAt: Date;
};
