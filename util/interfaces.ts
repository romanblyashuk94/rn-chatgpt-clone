export enum Role {
  User = 0,
  Bot = 1,
}

export interface Message {
  role: Role;
  content: string;
  imageUrl?: string;
  prompt?: string;
}

interface Chat {
  id: number;
  title: string;
}

export interface Model {
  title: string;
  subTitle: string;
  key: string;
  icon: import("expo-symbols").SFSymbol;
}
