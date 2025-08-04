
import React, { useEffect, useState } from 'react';
import SignIn from './SignIn';
import LogOut from './LogOut';
import { supabase } from '../supabase';

const style = {
  nav: `bg-gray-800 h-20 flex justify-between items-center px-6`,
  heading: `text-white text-3xl font-bold`,
  userInfo: `text-white text-sm mr-4`,
};

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
      setAuthError(error);
      setLoading(false);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      getUser(); // Re-fetch user on sign-in/out
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className={style.nav}>
      <h1 className={style.heading}>Chat App</h1>

      <div className="flex items-center gap-4">
        {loading && <p className={style.userInfo}>Checking login...</p>}
        {/* {authError && <p className="text-red-500">Error: {authError.message}</p>} */}
         {/* {authError && <p className="text-red-500">Error: {authError.message}</p>} */}
         {/* {!loading && !user && (
        <p className={style.userInfo}>Please log in to start using the chat app.</p>
      )} */}

        {user && !loading && (
          <span className={style.userInfo}>
            Hello, {user.user_metadata?.full_name || user.email}
          </span>
        )}

        {/* Show logout if user is logged in, else show sign in */}
        {!loading && (user ? <LogOut /> : <SignIn />)}
      </div>
    </div>
  );
};

export default Navbar;
