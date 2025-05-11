import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  color: string;
}

interface UserStore {
  user: User | null;
  users: User[];
  setUser: (user: User) => void;
  addUser: (user: User) => void;
  removeUser: (id: string) => void;
}

const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  users: [],
  setUser: (user) => set({ user }),
  addUser: (user) =>
    set((state) => ({
      users: [...state.users.filter((u) => u.id !== user.id), user],
    })),
  removeUser: (id) =>
    set((state) => ({ users: state.users.filter((u) => u.id !== id) })),
}));

export const generateUserId = () => Math.random().toString(36).substring(2, 9);

export const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];