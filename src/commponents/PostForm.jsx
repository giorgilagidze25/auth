import React, { useState } from 'react';
import { toast } from 'react-toastify';
export default function PostForm({ onAdd }) {
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      toast.warning('Please enter some content.');
      return;
    }

    const loadingToast = toast.loading('Adding post...');

    try {
      await onAdd(text);
      setText('');
      toast.update(loadingToast, {
        render: 'Post added!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      toast.update(loadingToast, {
        render: err.message || 'Error adding post',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="my-4 space-x-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write post"
        className="border w-[300px] p-2 ml-[250px]"
        required
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-2">Add Post</button>
    </form>
  );
}
