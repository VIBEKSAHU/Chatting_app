// import React, { useEffect, useState } from 'react';
// import { supabase } from '../supabase';
// import { useUser, useSession } from '@supabase/auth-helpers-react'; // ✅ Added useSession for accurate user ID

// const EMOJIS = ['👍', '❤️', '😂', '🎉', '😢'];

// const MessageReactions = ({ messageId }) => {
//   const user = useUser();
//   const session = useSession(); // ✅ Get session to access user.id
//   const userId = session?.user?.id; // ✅ Correct user ID
//   const [reactions, setReactions] = useState([]);

//   useEffect(() => {
//     fetchReactions();

//     const subscription = supabase
//       .channel('message_reactions')
//       .on(
//         'postgres_changes',
//         {
//           event: '*',
//           schema: 'public',
//           table: 'message_reactions',
//           filter: `message_id=eq.${messageId}`,
//         },
//         fetchReactions
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(subscription);
//     };
//   }, [messageId]);

//   useEffect(() => {
//     console.log('Reactions:', reactions);
//   }, [reactions]);

//   const fetchReactions = async () => {
//     const { data, error } = await supabase
//       .from('message_reactions')
//       .select('*')
//       .eq('message_id', messageId);

//     if (error) {
//       console.error('Error fetching reactions:', error.message);
//       return;
//     }

//     if (data) setReactions(data);
//   };

//   const handleReaction = async (emoji) => {
//     if (!userId) {
//       console.error('User ID not found. Cannot react.');
//       return;
//     }

//     const existing = reactions.find(
//       (r) => r.emoji === emoji && r.user_id === userId
//     );

//     if (existing) {
//       // ✅ Unreact if the same emoji is already selected by the user
//       const { error } = await supabase
//         .from('message_reactions')
//         .delete()
//         .eq('id', existing.id);

//       if (error) {
//         console.error('Failed to remove reaction:', error.message);
//       }
//     } else {
//       // ✅ React with new emoji
//       const payload = {
//         message_id: messageId,
//         user_id: userId,
//         emoji,
//         name: user?.user_metadata?.name || 'Anonymous',
//         avatar: user?.user_metadata?.avatar_url || '',
//       };

//       console.log('Inserting reaction:', payload); // ✅ Debugging info

//       const { error } = await supabase.from('message_reactions').insert(payload);

//       if (error) {
//         console.error('Failed to insert reaction:', error.message);
//       }
//     }
//   };

//   const getGroupedReactions = () => {
//     const grouped = {};

//     reactions.forEach((r) => {
//       if (!grouped[r.emoji]) {
//         grouped[r.emoji] = { count: 0, userReacted: false, names: [] };
//       }
//       grouped[r.emoji].count += 1;
//       grouped[r.emoji].names.push(r.name || 'Someone');
//       if (r.user_id === userId) {
//         grouped[r.emoji].userReacted = true;
//       }
//     });

//     return grouped;
//   };

//   const grouped = getGroupedReactions();

//   return (
//     <div className="flex gap-2 mt-2 flex-wrap">
//       {EMOJIS.map((emoji) => {
//         const reacted = grouped[emoji]?.userReacted;
//         const tooltip = grouped[emoji]?.names?.join(', ') || 'No reactions';

//         return (
//           <button
//             key={emoji}
//             onClick={() => handleReaction(emoji)}
//             title={tooltip}
//             className={`relative text-lg px-2 py-1 rounded-full border transition-all duration-150 transform hover:scale-110 focus:outline-none ${
//               reacted
//                 ? 'bg-blue-100 text-blue-800 border-blue-400 font-bold ring-2 ring-blue-300'
//                 : 'bg-gray-100 text-gray-800 border-gray-300'
//             }`}
//           >
//             <span>{emoji}</span>{' '}
//             {grouped[emoji]?.count > 0 && (
//               <span className="ml-1 text-sm font-medium">{grouped[emoji].count}</span>
//             )}
//           </button>
//         );
//       })}
//     </div>
//   );
// };

// export default MessageReactions;


import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useUser, useSession } from '@supabase/auth-helpers-react'; // ✅ Added useSession for accurate user ID

const EMOJIS = ['👍', '❤️', '😂', '🎉', '😢'];

const MessageReactions = ({ messageId }) => {
  const user = useUser();
  const session = useSession(); // ✅ Get session to access user.id
  const userId = session?.user?.id; // ✅ Correct user ID
  const [reactions, setReactions] = useState([]);

  useEffect(() => {
    fetchReactions();

    const subscription = supabase
      .channel('message_reactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_reactions',
          filter: `message_id=eq.${messageId}`,
        },
        fetchReactions
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [messageId]);

  useEffect(() => {
    console.log('Reactions:', reactions);
  }, [reactions]);

  const fetchReactions = async () => {
    const { data, error } = await supabase
      .from('message_reactions')
      .select('*')
      .eq('message_id', messageId);

    if (error) {
      console.error('Error fetching reactions:', error.message);
      return;
    }

    if (data) setReactions(data);
  };

  const handleReaction = async (emoji) => {
    if (!userId) {
      console.error('User ID not found. Cannot react.');
      return;
    }

    const existing = reactions.find(
      (r) => r.emoji === emoji && r.user_id === userId
    );

    if (existing) {
      // ✅ Unreact if the same emoji is already selected by the user
      const { error } = await supabase
        .from('message_reactions')
        .delete()
        .eq('id', existing.id);

      if (error) {
        console.error('Failed to remove reaction:', error.message);
      }
    } else {
      // ✅ React with new emoji
      const payload = {
        message_id: messageId,
        user_id: userId,
        emoji,
        name: user?.user_metadata?.name || 'Anonymous',
        avatar: user?.user_metadata?.avatar_url || '',
      };

      console.log('Inserting reaction:', payload); // ✅ Debugging info

      const { error } = await supabase.from('message_reactions').insert(payload);

      if (error) {
        console.error('Failed to insert reaction:', error.message);
      }
    }
  };

  const getGroupedReactions = () => {
    const grouped = {};

    reactions.forEach((r) => {
      if (!grouped[r.emoji]) {
        grouped[r.emoji] = { count: 0, userReacted: false, names: [] };
      }
      grouped[r.emoji].count += 1;
      grouped[r.emoji].names.push(r.name || 'Someone');
      if (r.user_id === userId) {
        grouped[r.emoji].userReacted = true;
      }
    });

    return grouped;
  };

  const grouped = getGroupedReactions();

  return (
    <div className="flex gap-2 mt-2 flex-wrap">
      {EMOJIS.map((emoji) => {
        const reacted = grouped[emoji]?.userReacted;
        const tooltip = grouped[emoji]?.names?.join(', ') || 'No reactions';

        return (
          <button
            key={emoji}
            onClick={() => handleReaction(emoji)}
            title={tooltip}
            className={`relative text-lg px-2 py-1 rounded-full border transition-all duration-150 transform hover:scale-110 focus:outline-none ${
              reacted
                ? 'bg-blue-100 text-blue-800 border-blue-400 font-bold ring-2 ring-blue-300'
                : 'bg-gray-100 text-gray-800 border-gray-300'
            }`}
          >
            <span>{emoji}</span>{' '}
            {grouped[emoji]?.count > 0 && (
              <span className="ml-1 text-sm font-medium">{grouped[emoji].count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default MessageReactions;
