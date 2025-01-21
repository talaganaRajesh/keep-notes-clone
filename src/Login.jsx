import React from 'react'

import { Link } from 'react-router-dom'

import { Github } from 'lucide-react'

function Login() {
    return (
        <div>
            <header className="bg-black shadow">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/">
                            <h1 className="text-xl cursor-pointer text-white font-bold">Keep <span className='text-yellow-500'>Notes</span></h1>
                        </Link>

                        <div className='flex justify-center gap-4'>
                            <Link to="/login">
                                <button className='bg-white text-black rounded-3xl px-6 py-2 md:hover:bg-orange-100 transition-all font-semibold'>Login</button>
                            </Link>
                            <a className='bg-white text-black p-2 hover:animate-none md:hover:rotate-12 rounded-full cursor-pointer transition-all' target='_blank' href='https://github.com/talaganaRajesh'><Github /></a>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-md mx-auto bg-gradient-to-r login-container p-8 rounded-xl">

                <button
                    // onClick={handleGoogleSignIn}
                    // disabled={isLoading.googleSignIn}
                    className="w-full flex flex-row justify-center gap-2 border-2 border-gray-200 hover:border-gray-300 bg-amber-50 items-center font-bold py-3 text-black rounded-2xl mb-4 transition-colors duration-300 disabled:opacity-50"
                >
                    <lord-icon
                        src="https://cdn.lordicon.com/eziplgef.json"
                        trigger="loop"
                    >
                    </lord-icon>
                    <span>Sign In with Google</span>
                </button>

            </div>




        </div>
    )
}

export default Login