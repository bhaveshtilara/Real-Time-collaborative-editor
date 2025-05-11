'use client';

import { useState, useEffect } from 'react';
import { useUserStore, generateUserId, getRandomColor } from '@/store/useUserStore';

export default function UsernamePrompt() {
  const [name, setName] = useState('');
  const { user, setUser, addUser } = useUserStore();

  useEffect(() => {
    if (!user) {
      const id = generateUserId();
      const color = getRandomColor();
      setUser({ id, name: '', color });
    }
  }, [user, setUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && user) {
      const updatedUser = { ...user, name };
      setUser(updatedUser);
      addUser(updatedUser);
    }
  };

  if (user?.name) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Enter Your Username</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full p-2 border rounded mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Join Editor
          </button>
        </form>
      </div>
    </div>
  );
}