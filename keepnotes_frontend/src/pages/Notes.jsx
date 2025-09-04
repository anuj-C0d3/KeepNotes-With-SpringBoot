import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../services/api';

// UI & Animation Libraries
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

// Icons
import { Plus, Trash2, Edit, Save, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const getToken = ()=>{
    if (typeof window !== "undefined"){
        return localStorage.getItem("token");
    }
    return null;
}

const Notes = () => {
    const navigate = useNavigate()
    // --- STATE MANAGEMENT ---
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // UI State
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedContent, setEditedContent] = useState("");
    const [token, setToken] = useState(getToken);

    if (!token) {
        navigate('/login');
    }
    // --- API CALLS ---
    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get("notes");
            setNotes(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load notes.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error("Title cannot be empty!");
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await axiosInstance.post("notes", { title, content });
            setNotes(prevNotes => [...prevNotes, res.data]);
            setTitle("");
            setContent("");
            toast.success("Note created successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create note.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        // Optimistic UI update
        const originalNotes = [...notes];
        setNotes(notes.filter(n => n.id !== id));
        toast.success("Note deleted!");

        try {
            await axiosInstance.delete(`notes/${id}`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete note. Restoring...");
            setNotes(originalNotes); // Revert on error
        }
    };

    const handleUpdate = async (id) => {
        if (!editedTitle.trim()) {
            toast.error("Title cannot be empty!");
            return;
        }
        const originalNotes = [...notes];

        // Optimistic update
        const updatedNote = { id, title: editedTitle, content: editedContent };
        setNotes(notes.map(n => (n.id === id ? updatedNote : n)));
        setEditingNoteId(null);
        toast.success("Note updated!");

        try {
            await axiosInstance.put(`notes/${id}`, { title: editedTitle, content: editedContent });
        } catch (error) {
            console.error(error);
            toast.error("Failed to update. Reverting changes...");
            setNotes(originalNotes); // Revert on error
        }
    };

    // --- EDITING LOGIC ---
    const startEditing = (note) => {
        setEditingNoteId(note.id);
        setEditedTitle(note.title);
        setEditedContent(note.content);
    };

    const cancelEditing = () => {
        setEditingNoteId(null);
    };

    // --- RENDER ---
    return (
        <div className="min-h-screen w-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
            <Toaster position="top-center" toastOptions={{
                style: { background: '#2d3748', color: '#e2e8f0' }
            }} />

            <div className="max-w-5xl mx-auto">
                {/* --- HEADER --- */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                        My Notes
                    </h1>
                    <p className="mt-2 text-slate-400">Create, edit, and manage your thoughts.</p>
                </motion.header>

                {/* --- CREATE NOTE FORM --- */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <form onSubmit={handleCreate} className="bg-slate-800 p-6 rounded-lg shadow-lg mb-10 space-y-4">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Note Title"
                            className="w-full bg-slate-700 text-slate-100 placeholder-slate-400 p-3 rounded-md border-2 border-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                        />
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Note Content..."
                            rows="4"
                            className="w-full bg-slate-700 text-slate-100 placeholder-slate-400 p-3 rounded-md border-2 border-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition resize-none"
                        />
                        <button
                            type="submit"
                            disabled={!title.trim() || isSubmitting}
                            className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:scale-105 active:scale-100"
                        >
                            {isSubmitting ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <><Plus size={20} /> Add Note</>
                            )}
                        </button>
                    </form>
                </motion.div>


                {/* --- NOTES LIST --- */}
                <main>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 size={40} className="animate-spin text-teal-500" />
                        </div>
                    ) : notes.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center text-slate-500 py-10"
                        >
                            <p>No notes found. Create your first one!</p>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {notes.map(note => (
                                    <motion.div
                                        key={note.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-md p-5 flex flex-col justify-between border border-slate-700"
                                    >
                                        {editingNoteId === note.id ? (
                                            /* --- EDITING VIEW --- */
                                            <div className="flex flex-col h-full">
                                                <input
                                                    type="text"
                                                    value={editedTitle}
                                                    onChange={(e) => setEditedTitle(e.target.value)}
                                                    className="bg-slate-700 text-lg font-bold mb-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                />
                                                <textarea
                                                    value={editedContent}
                                                    onChange={(e) => setEditedContent(e.target.value)}
                                                    rows="5"
                                                    className="bg-slate-700 text-slate-300 flex-grow p-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                />
                                                <div className="flex justify-end gap-2 mt-4">
                                                    <button onClick={() => handleUpdate(note.id)} className="p-2 rounded-full bg-green-500 hover:bg-green-400 transition"><Save size={18} /></button>
                                                    <button onClick={cancelEditing} className="p-2 rounded-full bg-gray-600 hover:bg-gray-500 transition"><X size={18} /></button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* --- DISPLAY VIEW --- */
                                            <div className="flex flex-col h-full">
                                                <div className="flex-grow">
                                                    <h2 className="text-xl font-bold text-teal-400 mb-2 break-words">{note.title}</h2>
                                                    <p className="text-slate-300 whitespace-pre-wrap break-words">{note.content}</p>
                                                </div>
                                                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-700">
                                                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => startEditing(note)} className="p-2 rounded-full text-blue-400 hover:bg-blue-500/20 transition"><Edit size={18} /></motion.button>
                                                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => toast((t) => (
                                                        <span className="flex flex-col items-center gap-3">
                                                            Are you sure you want to delete this?
                                                            <div className="flex gap-4">
                                                                <button onClick={() => { handleDelete(note.id); toast.dismiss(t.id); }} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                                                                <button onClick={() => toast.dismiss(t.id)} className="bg-slate-600 text-white px-3 py-1 rounded">Cancel</button>
                                                            </div>
                                                        </span>
                                                    ))} className="p-2 rounded-full text-red-400 hover:bg-red-500/20 transition"><Trash2 size={18} /></motion.button>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default Notes;