import React, { useState, useEffect, useRef } from 'react';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export default function ChatWindow({ user, chatId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user || !chatId) return;
    const unsub = onSnapshot(doc(db, 'users', user.uid, 'chats', chatId), (snap) => {
      if (snap.exists()) {
        setMessages(snap.data().messages || []);
      }
    });
    return unsub;
  }, [user, chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const chatRef = doc(db, 'users', user.uid, 'chats', chatId);
    await updateDoc(chatRef, {
      messages: [...messages, { role: 'user', content: input, timestamp: Date.now() }],
      updatedAt: Date.now()
    });
    setInput('');
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 overflow-y-auto p-4 bg-white">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-4 py-2 rounded-lg max-w-xl ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}>{msg.content}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t bg-gray-50 flex">
        <input
          className="flex-1 p-2 border rounded mr-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          placeholder="Type your message..."
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
