// App.jsx
import { useState, useEffect, useRef } from 'react';
import { Plus, Search, Pin, Trash2, Github } from 'lucide-react';
import './App.css';

import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';


import { Link } from 'react-router-dom';

const STORAGE_KEY = 'keepNotes';


import { Dock, DockIcon } from "@/components/ui/dock";
import { motion, AnimatePresence } from "framer-motion";



function HomePage() {



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



  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem(STORAGE_KEY);
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);



  const addNote = (note) => {
    setNotes(prevNotes => [{
      id: Date.now(),
      title: note.title,
      content: note.content,
      color: note.color || '#ffffff',
      pinned: false,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    }, ...prevNotes]);
  };

  const updateNote = (id, updatedNote) => {
    setNotes(prevNotes => prevNotes.map(note =>
      note.id === id ? {
        ...note,
        ...updatedNote,
        lastModified: new Date().toISOString()
      } : note
    ));
  };

  const deleteNote = (id) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  };

  const togglePin = (id) => {
    setNotes(prevNotes => {
      const updatedNotes = prevNotes.map(note =>
        note.id === id ? { ...note, pinned: !note.pinned } : note
      );
      return [
        ...updatedNotes.filter(note => note.pinned),
        ...updatedNotes.filter(note => !note.pinned)
      ];
    });
  };



  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.lastModified.includes(searchQuery)
  );

  return (
    <div className="h-screen bg-yellow-50">
      <header className="bg-black shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <h1 className="md:text-xl text-sm cursor-pointer text-white font-bold">Keep <span className='text-yellow-500'>Notes</span></h1>
            </Link>
            <div className="md:w-80 w-32 self-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search notes..."
                  className="w-full pl-10 pr-4 md:py-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>


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
                    <button className='bg-white text-black rounded-3xl px-6 py-2 md:hover:bg-orange-100 transition-all font-semibold'>Login </button>
                  </Link>
                  <a className='bg-white text-black p-2 hover:animate-none md:hover:rotate-12 rounded-full cursor-pointer transition-all' target='_blank' href='https://github.com/talaganaRajesh'><Github /></a>
                </div>

              )}



            </div>


          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          {!showAddNote ? (
            <button
              onClick={() => setShowAddNote(true)}
              className="flex items-center gap-2 px-4 py-2 font-semibold bg-white rounded-lg shadow hover:shadow-lg hover:bg-green-50 transition-all border border-yellow-300"
            >
              <Plus size={20} />
              Take a note...
            </button>
          ) : (
            <NoteEditor
              onSave={(note) => {
                addNote(note);
                setShowAddNote(false);
              }}
              onCancel={() => setShowAddNote(false)}
            />
          )}
        </div>

        {filteredNotes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredNotes.map(note => (
              <Note
                key={note.id}
                note={note}
                onUpdate={updateNote}
                onDelete={deleteNote}
                onPin={togglePin}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}



function NoteEditor({ note, onSave, onCancel }) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [color, setColor] = useState(note?.color || '#ffffff');


  const colors = [
    '#ffffff', '#f28b82', '#fbbc04', '#fff475',
    '#ccff90', '#a7ffeb'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() || content.trim()) {
      onSave({ title, content, color });
      setTitle('');
      setContent('');
      setColor('#ffffff');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 transition-all">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-2 p-2 border-b-2 border-gray-300 rounded-lg focus:outline-none text-lg font-medium"
      />
      <textarea
        placeholder="Take a note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border-none focus:outline-none resize-none min-h-[200px]"
      />
      <div className="flex justify-center h-40 md:h-0 items-center mt-4 relative">
        <div className='absolute bottom-28 md:bottom-0' >
          <Dock direction="middle" className="grid grid-cols-3 md:grid-cols-6">
            {colors.map(c => (
              <DockIcon className="bg-red-50 flex justify-center items-center">

                <button
                  key={c}
                  type="button"
                  className={`w-6 h-6 rounded-full border ${color === c ? 'ring-2 ring-yellow-500' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              </DockIcon>

            ))}
          </Dock>
        </div>
        <div className=" gap-2 md:bottom-2 bottom-0 right-0 absolute">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}

function Note({ note, onUpdate, onDelete, onPin }) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className='z-50 bg-yellow-500 border-yellow-200 border-2 shadow-lg rounded-lg size-max transition-all inset-0'>
        <NoteEditor
          note={note}
          onSave={(updatedNote) => {
            onUpdate(note.id, updatedNote);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>

    );
  }

  return (



    <div
      className="rounded-lg shadow p-4 break-words cursor-pointer hover:shadow-lg transition-all"
      style={{ backgroundColor: note.color }}
    // onClick={() => setIsEditing(true)}

    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium"
          onClick={() => setIsEditing(true)}
        >{note.title}</h3>
        <div className="flex gap-2"
        >
          <button
            onClick={() => onPin(note.id)}
            className={`p-1 rounded hover:bg-black/10 ${note.pinned ? 'text-blue-600' : ''}`}
          >
            <Pin size={16} />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-1 rounded hover:bg-black/10 text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div onClick={() => setIsEditing(true)}>
        <p className="whitespace-pre-wrap">{note.content}</p>
        <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
          <span>
            {new Date(note.lastModified).toLocaleDateString('en-GB')}
          </span>

        </div>

      </div>
    </div>
  );
}

export default HomePage;