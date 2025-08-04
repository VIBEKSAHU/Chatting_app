import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

export function useUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user on mount
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    // Subscribe to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    // Cleanup listener on unmount
    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  return { user };
}
