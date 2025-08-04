
// import React, { useState,useRef } from 'react';
// import { supabase } from '../supabase';

// const SendMessage = ({ scroll }) => {
//   const [input, setInput] = useState('');
//   const typingTimeout = useRef(null); // 🟢 Ref to store timeout ID for stopping typing after delay

//   // 🟢 Function to update typing status in the database
//   const sendTypingStatus = async (isTyping) => {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) return;

//     await supabase
//       .from('typing_status')
//       .upsert({
//         user_id: user.id,
//         is_typing: isTyping,
//         updated_at: new Date().toISOString(),
//       });
//   };

//   // 🟢 Triggered whenever the user types
//   const handleTyping = async (e) => {
//     const newValue = e.target.value;
//     setInput(newValue);

//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) return;

//     // Immediately set typing status to true
//     await sendTypingStatus(true);

//     // Clear the previous timeout if user keeps typing
//     if (typingTimeout.current) clearTimeout(typingTimeout.current);

//     // After 2 seconds of no typing, update status to false
//     typingTimeout.current = setTimeout(() => {
//       sendTypingStatus(false);
//     }, 2000);
//   };

//   // ✉️ Handles sending the message
//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     // Get current authenticated user
//     const {
//       data: { user },
//       error: userError,
//     } = await supabase.auth.getUser();

//     if (userError || !user) {
//       console.error('User not authenticated:', userError?.message);
//       return;
//     }

//     // Insert message into Supabase messages table
//     const { error } = await supabase.from('messages').insert([
//       {
//         text: input,
//         name: user.user_metadata.full_name || 'Anonymous',
//         avatar: user.user_metadata.avatar_url || '',
//         uid: user.id,
//         timestamp: new Date().toISOString(), // Ensure this matches your DB column
//       },
//     ]);

//     if (error) {
//       console.error('Error sending message:', error.message);
//     } else {
//       setInput(''); // Reset input
//       scroll.current?.scrollIntoView({ behavior: 'smooth' }); // Scroll to bottom
//     }

//     // ✅ Mark user as not typing once message is sent
//     await sendTypingStatus(false);
//   };

//   return (
//     <form onSubmit={sendMessage} className="bg-gray-200 p-4 flex items-center gap-2">
//       <input
//         className="flex-1 p-2 rounded border border-gray-300 focus:outline-none"
//         value={input}
//         // onChange={(e) => setInput(e.target.value)}
//         onChange={handleTyping} 
//         placeholder="Type your message..."
//       />
//       <button
//         type="submit"
//         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//       >
//         Send
//       </button>
//     </form>
//   );
// };

// export default SendMessage;



// 


import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';

const SendMessage = ({ scroll }) => {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null); // 👤 Store full user object
  const typingTimeoutRef = useRef(null);  // ⏳ Ref to manage typing timeout

  // 🔐 Fetch and store current user info on component mount
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        console.error("Auth user fetch error:", error);
      }
    };

    getCurrentUser();
  }, []);

  // 📤 Handle sending a new message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !user?.id) return;

    // ✅ Insert message into `messages` table
    const { error: messageError } = await supabase.from('messages').insert([
      {
        text: message,
        uid: user.id, // 🔁 Make sure your table has a 'uid' column or update this field
        name: user?.user_metadata?.name || 'Anonymous',
        avatar: user?.user_metadata?.avatar_url || '',
        timestamp: new Date().toISOString(),
      },
    ]);

    if (messageError) {
      console.error('Message insert error:', messageError);
    }

    setMessage('');
    scroll.current?.scrollIntoView({ behavior: 'smooth' });

    // 🛑 Set is_typing = false after sending
    const { error: typingOffError } = await supabase.from('typing_status').upsert([
      {
        user_id: user.id,
        name: user?.user_metadata?.name || 'Anonymous',
        avatar: user?.user_metadata?.avatar_url || '',
        is_typing: false,
      },
    ]);

    if (typingOffError) {
      console.error('Typing status OFF error:', typingOffError);
    }
  };

  // ✍️ Update typing status when user types
  const handleTyping = async (e) => {
    const newValue = e.target.value;
    setMessage(newValue);

    if (!user?.id) return;

    // 🟢 Mark user as typing
    const { error: typingOnError } = await supabase.from('typing_status').upsert([
      {
        user_id: user.id,
        name: user?.user_metadata?.name || 'Anonymous',
        avatar: user?.user_metadata?.avatar_url || '',
        is_typing: true,
      },
    ]);

    if (typingOnError) {
      console.error('Typing status ON error:', typingOnError);
    }

    // 🕒 Set timeout to auto-clear typing status after 3 seconds
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(async () => {
      const { error: timeoutError } = await supabase.from('typing_status').upsert([
        {
          user_id: user.id,
          name: user?.user_metadata?.name || 'Anonymous',
          avatar: user?.user_metadata?.avatar_url || '',
          is_typing: false,
        },
      ]);

      if (timeoutError) {
        console.error('Typing timeout status error:', timeoutError);
      }
    }, 3000);
  };

  return (
    <form
      onSubmit={sendMessage}
      className="flex p-4 border-t border-gray-200 bg-white"
    >
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={handleTyping}
        className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-blue-300"
      />
      <button
        type="submit"
        className="ml-2 px-4 py-2 text-white bg-blue-500 rounded-full hover:bg-blue-600"
      >
        Send
      </button>
    </form>
  );
};

export default SendMessage;
