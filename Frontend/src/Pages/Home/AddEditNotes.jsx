import React, { useState } from 'react';
import TagInput from '../../Component/Input/TagInput';
import { MdClose } from "react-icons/md";
import axiosInstance from '../../Utils/axiosInstance.js';

function AddEditNotes({ noteData, type, getAllNotes, onclose, showToastMessage }) {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);

  // Add New Note
  async function addNewNote() {
    try {
      const response = await axiosInstance.post('/add-note', {
        title,
        content,
        tags
      });

      if (response.data && response.data.note) {
        getAllNotes();
        onclose();
        showToastMessage('Note Added Successfully');
      }
    } catch (error) {
      console.error('Error found in add new note', error);
    }
  }

  // Edit Note
  async function editNote() {
    try {
      const response = await axiosInstance.put(`/edit-note/${noteData?._id}`, {
        title,
        content,
        tags
      });

      if (response.data && response.data.note) {
        getAllNotes();
        onclose();
        showToastMessage('Note Updated Successfully');
      }
    } catch (error) {
      console.error('Error found in edit note', error);
    }
  }

  function handleAddEditNote() {
    if (!title) {
      setError('Please add a title');
      return;
    }

    if (!content) {
      setError('Please add content');
      return;
    }

    if (tags.length === 0) {
      setError('Please add at least one tag');
      return;
    }

    setError(null);

    if (type === 'edit') {
      editNote();
    } else {
      addNewNote();
    }
  }

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onclose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-label">Title</label>
        <input
          type="text"
          placeholder="Go to gym"
          className="text-2xl text-slate-950 border rounded-md mt-1 py-2 outline-none"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">CONTENT</label>
        <textarea
          placeholder="Content"
          className="text-xs text-slate-950 bg-slate-200 p-2 rounded-md outline-none"
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
      </div>

      <div className="mt-3">
        <label className="input-label">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

      <button className="btn-primary font-medium mt-5 p-3" onClick={handleAddEditNote}>
        {type === 'edit' ? 'UPDATE' : 'ADD'}
      </button>
    </div>
  );
}

export default AddEditNotes;
