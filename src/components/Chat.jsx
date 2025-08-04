import React, { useEffect, useRef, useState } from 'react';
import Message from './Message';
import SendMessage from './SendMessage';
import { supabase } from '../supabase';

const Chat = () => {
  const [messages, setMessages] = useState([]); // 💬 List of chat messages
  const [typingUsers, setTypingUsers] = useState([]); // 👥 List of users currently typing
  const [currentUserId, setCurrentUserId] = useState(null); // 🧍 Current logged-in user's ID

  const scroll = useRef(null); // 🔽 Ref to scroll to bottom of chat

  useEffect(() => {
    const fetchInitialData = async () => {
      // 🔐 Get current user info
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id); // 🎯 Save current user ID to filter self from typing indicator
      }

      // 📦 Fetch initial message list (ordered chronologically)
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: true });

      if (messageError) {
        console.error('❌ Error fetching messages:', messageError);
      } else {
        setMessages(messageData);

        // 📜 Auto-scroll to latest message
        setTimeout(() => {
          scroll.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    };

    fetchInitialData();

    // 🔴 Real-time listener for new messages
    const messageChannel = supabase
      .channel('realtime:messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]); // ➕ Add new message to list

          // 🧷 Scroll down to view new message
          setTimeout(() => {
            scroll.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      )
      .subscribe();

    // 🔴 Real-time listener for typing status changes
    const typingChannel = supabase
      .channel('realtime:typing_status')
      .on(
        'postgres_changes',
        {
          event: '*', // ✅ Track both UPDATE and INSERT (useful for upserts)
          schema: 'public',
          table: 'typing_status',
        },
        (payload) => {
          const { user_id, name, is_typing } = payload.new;

          // 🚫 Skip if event is from current user
          if (user_id === currentUserId) return;

          setTypingUsers((prev) => {
            const alreadyTyping = prev.find((u) => u.user_id === user_id);

            if (is_typing) {
              // 👆 Add user to list if they're typing and not already present
              if (!alreadyTyping) {
                return [...prev, { user_id, name }];
              }
              return prev;
            } else {
              // 👇 Remove user from list if they stopped typing
              return prev.filter((u) => u.user_id !== user_id);
            }
          });
        }
      )
      .subscribe();

    // ♻️ Clean up real-time subscriptions on unmount
    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(typingChannel);
    };
  }, []);

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <main className="flex-1 p-4 overflow-y-auto">
        {/* 📬 Display all chat messages */}
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}

        {/* ✍️ Display typing indicator */}
        {typingUsers.length > 0 && (
          <div className="text-sm text-gray-500 italic mb-2">
            {typingUsers.map((u) => u.name).join(', ')}{' '}
            {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}

        {/* ⬇️ Scroll anchor */}
        <div ref={scroll} />
      </main>

      {/* 📨 Input box for sending messages */}
      <SendMessage scroll={scroll} />
    </div>
  );
};

export default Chat;
