export interface User {
  id: string;
  name: string;
  gender: string;
  email: string;
  avatar?: string;
  username: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  xp: number;
}