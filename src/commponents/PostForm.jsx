import React, { useState } from 'react';
import { toast } from 'react-toastify';

function PostForm({ onAdd }) {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      toast.warning('Please enter some content.');
      return;
    }

    const loadingToast = toast.loading('Adding post...');

    try {
      await onAdd(text, image);
      setText('');
      setImage(null);
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
    <form onSubmit={handleSubmit} className="my-4 space-y-4 flex flex-col items-center">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write post"
        className="border w-[300px] p-2"
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="w-[300px]"
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition">
        Add Post
      </button>
    </form>
  );
}

export default PostForm;
