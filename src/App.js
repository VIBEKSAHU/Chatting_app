


import React, { useEffect, useState } from 'react'
import { supabase } from './supabase'
// import SignIn from './components/SignIn'
import Chat from './components/Chat'
import Navbar from './components/Navbar'
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { SpeedInsights } from "@vercel/speed-insights/react"

const App = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check session on mount
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Listen for login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => listener?.subscription.unsubscribe()
  }, [])

  return (
    <SessionContextProvider supabaseClient={supabase}>
    <div className="max-w-[728px] mx-auto text-center mt-10">
      <section className="flex flex-col h-[90vh] bg-gray-100 shadow-xl border relative">
        <Navbar user={user} />
        {/* {user ? <Chat user={user} /> : <SignIn />} */}
        {user && <Chat user={user} />}

      </section>
      <SpeedInsights />
    </div>
    </SessionContextProvider>
  )
}

export default App

