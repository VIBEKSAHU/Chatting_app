

import React from 'react';
import { supabase } from '../supabase';

const style = {
  button: `bg-gray-200 px-4 py-2 hover:bg-gray-100`,
};

const LogOut = () => {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <button onClick={handleLogout} className={style.button}>
      Logout
    </button>
  );
};

export default LogOut;
