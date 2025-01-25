import React from 'react'

import { Link, Navigate } from 'react-router-dom'

import { Github } from 'lucide-react'

import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

import { useNavigate } from 'react-router-dom';

import {
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";





function Login() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const handleSignOut = async () => {

        const confirm = window.confirm("Are you sure you want to log out?");

        if (!confirm) {
            return;
        }
        try {
            await signOut(auth);

        }
        catch (error) {
            console.log("error in signout");
        }
    };

    const [userIcon, setUserIcon] = useState(null);

    useEffect(() => {
        if (user) {
            setUserIcon(user.displayName[0].toUpperCase());
        }
    })

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null); // Ref for the menu

    // Toggle menu visibility
    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };


    // Close the menu if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();

        try {
            await signInWithPopup(auth, provider);
            navigate('/')
        }
        catch (error) {
            console.log("error in signin with google ");
        }
    };

    return (
        <div>
            <header className="bg-black shadow">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/">
                            <h1 className="text-xl cursor-pointer text-white font-bold">Keep <span className='text-yellow-500'>Notes</span></h1>
                        </Link>


                        <div className='flex justify-center gap-4'>

                            {user ? (
                                <div className='relative' ref={menuRef}>

                                    <button
                                        onClick={toggleMenu}

                                        className='bg-yellow-500 text-black rounded-full size-10 md:hover:bg-yellow-600 transition-all font-semibold'
                                    >
                                        {userIcon}
                                    </button>

                                    {/* Dropdown Menu */}
                                    <AnimatePresence>
                                        {isMenuOpen && (
                                            <motion.div
                                                className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10"
                                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <ul className="py-2 px-1 bg-amber-50 rounded-xl">
                                                    <li className="px-4 py-2  rounded-2xl mb-1 hover:bg-amber-100 transition-all font-semibold cursor-pointer">
                                                        <Link to="/login">Change Account</Link>
                                                    </li>
                                                    <li className="px-4 py-2 rounded-2xl hover:bg-amber-100 transition-all font-semibold cursor-pointer" onClick={handleSignOut}>
                                                        Log Out
                                                    </li>
                                                </ul>
                                            </motion.div>
                                        )}

                                    </AnimatePresence>

                                </div>
                            ) : (

                                <div className='flex justify-center gap-4'>
                                    <Link to="/login">
                                        <button className='bg-white text-black rounded-3xl px-6 py-2 md:hover:bg-orange-100 transition-all font-semibold'>Login</button>
                                    </Link>
                                    <a className='bg-white text-black p-2 hover:animate-none md:hover:rotate-12 rounded-full cursor-pointer transition-all' target='_blank' href='https://github.com/talaganaRajesh'><Github /></a>
                                </div>

                            )}



                        </div>


                    </div>
                </div>
            </header>

            <div className="max-w-md mx-auto bg-gradient-to-r login-container p-8 rounded-xl">

                <button
                    onClick={handleGoogleSignIn}
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