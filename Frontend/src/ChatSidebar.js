import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';

export default function ChatSidebar({ user, selectedChatId, onSelectChat }) {
  const [chats, setChats] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'users', user.uid, 'chats'), orderBy('updatedAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setChats(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, [user]);

  const handleNewChat = async () => {
    await addDoc(collection(db, 'users', user.uid, 'chats'), {
      title: 'New Chat',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: []
    });
  };

  const handleRename = async (chatId) => {
    await updateDoc(doc(db, 'users', user.uid, 'chats', chatId), {
      title: renameValue,
      updatedAt: Date.now()
    });
    setRenamingId(null);
    setRenameValue('');
  };

  const handleDelete = async (chatId) => {
    await deleteDoc(doc(db, 'users', user.uid, 'chats', chatId));
    setMenuOpenId(null);
  };

  return (
    <div className="w-64 bg-gray-100 h-full flex flex-col border-r">
      <button className="m-2 p-2 bg-blue-500 text-white rounded" onClick={handleNewChat}>+ New Chat</button>
      <div className="flex-1 overflow-y-auto">
        {chats.map(chat => (
          <div key={chat.id} className={`flex items-center px-2 py-2 cursor-pointer hover:bg-gray-200 ${selectedChatId === chat.id ? 'bg-blue-200' : ''}`}
            onClick={() => onSelectChat(chat.id)}>
            {renamingId === chat.id ? (
              <input
                className="flex-1 mr-2 p-1 border rounded"
                value={renameValue}
                onChange={e => setRenameValue(e.target.value)}
                onBlur={() => setRenamingId(null)}
                onKeyDown={e => { if (e.key === 'Enter') handleRename(chat.id); }}
                autoFocus
              />
            ) : (
              <span className="flex-1 truncate">{chat.title}</span>
            )}
            <div className="relative">
              <button className="ml-2" onClick={e => { e.stopPropagation(); setMenuOpenId(menuOpenId === chat.id ? null : chat.id); }}>⋮</button>
              {menuOpenId === chat.id && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={e => { e.stopPropagation(); setRenamingId(chat.id); setRenameValue(chat.title); setMenuOpenId(null); }}>Rename</button>
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600" onClick={e => { e.stopPropagation(); handleDelete(chat.id); }}>Delete</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
