import React, { useState } from 'react'
import { supabase } from '../supabase'
import toast, { Toaster } from 'react-hot-toast'

const SignIn = () => {
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin, // make sure this URI is whitelisted in Google Console
      },
    })

    if (error) {
      setLoading(false)
      toast.error('Login failed: ' + error.message)
      console.error('Supabase Login Error:', error)
    }
  }

  return (
    <div className="flex flex-col items-center mt-6">
      <Toaster position="top-center" reverseOrder={false} />
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className={`flex items-center gap-3 bg-white text-gray-700 font-medium px-6 py-2 rounded-lg shadow-md border border-gray-300 transition hover:bg-gray-100 hover:shadow-lg active:scale-95 ${
          loading ? 'opacity-60 cursor-not-allowed' : ''
        }`}
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google icon"
          className="w-5 h-5"
        />
        {loading ? (
          <div className="flex items-center gap-2">
            <span className="animate-spin border-2 border-transparent border-t-blue-500 rounded-full w-4 h-4"></span>
            Signing in...
          </div>
        ) : (
          <span>Sign in with Google</span>
        )}
      </button>
    </div>
  )
}

export default SignIn
