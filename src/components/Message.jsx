


// import React, { useState } from 'react';
// import MessageReactions from './MessageReactions';
// import { useUser } from '@supabase/auth-helpers-react';
// import { format, isToday, isYesterday } from 'date-fns';

// const Message = ({ message }) => {
//   const user = useUser();
//   const [showReactions, setShowReactions] = useState(false);

//   if (!message) return null;

//   const { text, name = 'Unknown', avatar = '', uid = '' } = message;
//   const isOwnMessage = user && uid === user.id;

//   const formatTimestamp = (timestamp) => {
//     if (!timestamp) return '';
//     const date = new Date(timestamp);
//     if (isToday(date)) return `Today at ${format(date, 'p')}`;
//     if (isYesterday(date)) return `Yesterday at ${format(date, 'p')}`;
//     return `${format(date, 'MMM d, yyyy')} at ${format(date, 'p')}`;
//   };

//   const formattedTime = formatTimestamp(message.timestamp);

//   return (
//     <div
//       className={`flex mb-4 px-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
//     >
//       {/* Avatar on left */}
//       {!isOwnMessage && (
//         <img
//           src={avatar || 'https://via.placeholder.com/40'}
//           alt={`${name}'s avatar`}
//           className="w-10 h-10 rounded-full mr-2 self-end"
//         />
//       )}

//       <div className="max-w-xs">
//         {/* Name on top */}
//         <p className={`text-xs font-semibold mb-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
//           {name}
//         </p>

//         {/* Message bubble */}
//         <div
//           onClick={() => setShowReactions((prev) => !prev)}
//           className={`relative cursor-pointer p-3 rounded-2xl shadow-sm transition-all duration-150 ease-in-out ${
//             isOwnMessage
//               ? 'bg-blue-100 text-gray-800 rounded-br-none'
//               : 'bg-gray-100 text-gray-900 rounded-bl-none'
//           }`}
//         >
//           <p>{text}</p>

//           {/* Timestamp */}
//           {formattedTime && (
//             <p className="text-[10px] text-gray-500 mt-1 text-right">{formattedTime}</p>
//           )}
//         </div>

//         {/* Emoji Reactions */}
//         {showReactions && (
//           <div className="mt-1">
//             <MessageReactions messageId={message.id} />
//           </div>
//         )}
//       </div>

//       {/* Avatar on right */}
//       {isOwnMessage && (
//         <img
//           src={avatar || 'https://via.placeholder.com/40'}
//           alt={`${name}'s avatar`}
//           className="w-10 h-10 rounded-full ml-2 self-end"
//         />
//       )}
//     </div>
//   );
// };

// export default Message;


import React, { useState } from 'react';
import MessageReactions from './MessageReactions';
import { useUser } from '@supabase/auth-helpers-react';
import { format, isToday, isYesterday } from 'date-fns';

const Message = ({ message }) => {
  const user = useUser();
  const [showReactions, setShowReactions] = useState(false);

  if (!message) return null;

  const { text, name = 'Unknown', avatar = '', uid = '' } = message;
  const isOwnMessage = user && uid === user.id;

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isToday(date)) return `Today at ${format(date, 'p')}`;
    if (isYesterday(date)) return `Yesterday at ${format(date, 'p')}`;
    return `${format(date, 'MMM d, yyyy')} at ${format(date, 'p')}`;
  };

  const formattedTime = formatTimestamp(message.timestamp);
   // 🔧 Fallback avatar if missing
  const avatarUrl = avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;
  return (
    <div
      className={`flex gap-3 mb-4 px-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
      onClick={() => setShowReactions(prev => !prev)}
    >
      {!isOwnMessage && (
        <img
          // src={avatar || 'https://via.placeholder.com/40'}
          src={avatarUrl}
          alt={`${name}'s avatar`}
          className="w-10 h-10 rounded-full self-start"
        />
      )}

      <div className="max-w-xs">
        {/* 🧑‍💼 Name above bubble */}
        <p className={`text-xs font-semibold mb-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
          {name}
        </p>

        {/* 💬 Message bubble */}
        <div
          className={`relative cursor-pointer p-3 rounded-2xl shadow-sm relative bg-gray-100 ${
            isOwnMessage ? 'rounded-br-none bg-blue-100 text-right' : 'rounded-bl-none'
          }`}
        >
          <p className="text-sm text-gray-800">{text}</p>

          {/* ⏱️ Timestamp */}
          {formattedTime && (
            <p className="text-[10px] text-gray-400 mt-1">
              {formattedTime}
            </p>
          )}

          {/* Emoji Reactions (toggle on message click) */}
          {showReactions && (
            <div className="mt-2">
              <MessageReactions messageId={message.id} />
            </div>
          )}
        </div>
      </div>

      {isOwnMessage && (
        <img
          src={avatar || 'https://via.placeholder.com/40'}
          alt={`${name}'s avatar`}
          className="w-10 h-10 rounded-full self-start"
        />
      )}
    </div>
  );
};

export default Message;
