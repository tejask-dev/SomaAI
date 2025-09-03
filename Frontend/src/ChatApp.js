import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';

export default function ChatApp() {
  const [user, setUser] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return unsub;
  }, []);

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Please sign in to use the chat.</div>;
  }

  return (
    <div className="flex h-screen w-screen">
      <ChatSidebar user={user} selectedChatId={selectedChatId} onSelectChat={setSelectedChatId} />
      <div className="flex-1">
        {selectedChatId ? (
          <ChatWindow user={user} chatId={selectedChatId} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">Select or create a chat to start messaging.</div>
        )}
      </div>
    </div>
  );
}
