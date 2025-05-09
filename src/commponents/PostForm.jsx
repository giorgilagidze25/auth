import React, { useState } from 'react';

export default function PostForm({ onAdd }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(text);
    setText('');
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
