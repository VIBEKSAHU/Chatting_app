import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

const Reactions = ({ messageId }) => {
  const [reactions, setReactions] = useState([]);

  useEffect(() => {
    const fetchReactions = async () => {
      const { data, error } = await supabase
        .from('message_reactions')
        .select('emoji, count:emoji')
        .eq('message_id', messageId)
        .group('emoji');

      if (error) {
        console.error('Error fetching reactions:', error.message);
      } else {
        setReactions(data);
      }
    };

    fetchReactions();

    // Optionally: set up realtime subscription later
  }, [messageId]);

  if (!reactions.length) return null;

  return (
    <div className="flex gap-2 mt-1 ml-4 text-sm">
      {reactions.map(({ emoji, count }) => (
        <div
          key={emoji}
          className="flex items-center gap-1 px-2 py-1 bg-gray-200 rounded-full shadow-sm"
        >
          <span>{emoji}</span>
          <span className="text-xs font-medium">{count}</span>
        </div>
      ))}
    </div>
  );
};

export default Reactions;
