'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { getWebrtcProvider } from '@/lib/yjs';

export default function UserStatus() {
  const { users, addUser, removeUser } = useUserStore();

  useEffect(() => {
    const provider = getWebrtcProvider();
    const awareness = provider.awareness;

    // Update users when awareness changes
    const handleUpdate = () => {
      const states = awareness.getStates();
      console.log('Awareness states:', states);
      const connectedUsers = Array.from(states.entries()).map(([clientId, state]) => ({
        id: clientId.toString(),
        name: state.user?.name || 'Anonymous',
        color: state.user?.color || '#000000',
      }));

      connectedUsers.forEach((user) => addUser(user));
      const currentIds = connectedUsers.map((u) => u.id);
      users.forEach((user) => {
        if (!currentIds.includes(user.id)) {
          removeUser(user.id);
        }
      });
    };

    awareness.on('change', handleUpdate);

    // Cleanup
    return () => {
      awareness.off('change', handleUpdate);
    };
  }, [users, addUser, removeUser]);

  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg max-w-4xl mx-auto mt-4">
      <span className="font-semibold">Editing:</span>
      {users.length === 0 ? (
        <span className="text-gray-500">No one is editing</span>
      ) : (
        users.map((user) => (
          <div key={user.id} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: user.color }}
            />
            <span>{user.name} is editing...</span>
          </div>
        ))
      )}
    </div>
  );
}