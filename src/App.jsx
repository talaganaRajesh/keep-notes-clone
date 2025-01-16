// App.jsx
import { useState, useEffect } from 'react';
import { Plus, Search, Pin, Trash2, Github } from 'lucide-react';
import './App.css';

const STORAGE_KEY = 'keepNotes';

function App() {
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
            <h1 className="text-xl text-white font-bold">Keep <span className='text-yellow-500'>Notes</span></h1>
            <div className="w-80 self-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search notes..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <a className='bg-white text-black p-2 hover:animate-none md:hover:rotate-12 rounded-full cursor-pointer transition-all' href='https://github.com/talaganaRajesh'><Github /></a>
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
    '#ccff90', '#a7ffeb', '#cbf0f8', '#aecbfa',
    '#d7aefb', '#fdcfe8', '#e6c9a8', '#e8eaed'
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
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4">
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
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-2">
          {colors.map(c => (
            <button
              key={c}
              type="button"
              className={`w-6 h-6 rounded-full border ${color === c ? 'ring-2 ring-yellow-500' : ''}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        <div className="flex gap-2">
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

export default App;