import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import PostForm from './PostForm';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const navigate = useNavigate();

  const fetchPosts = async () => {
    const token = Cookies.get('token');
    const res = await fetch('https://reschoolexpres.vercel.app/posts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        setPosts(data);
        if (data[0]?.author) {
          setUserId(data[0]?.author._id);
        }
      } else {
        setPosts([]);
      }
    } else {
      Cookies.remove('token');
      navigate('/sign-in');
    }
  };

  const searchPostById = async () => {
    if (!searchId.trim()) {
      setSearchResult({ notFound: true });
      return;
    }

    const token = Cookies.get('token');
    const res = await fetch(`https://reschoolexpres.vercel.app/posts/search/${searchId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (res.ok) {
      const data = await res.json();
      setSearchResult(data);
    } else {
      setSearchResult({ notFound: true });
    }
  };

  const addPost = async (content) => {
    const token = Cookies.get('token');
    const res = await fetch('https://reschoolexpres.vercel.app/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({ content }),
    });

    if (res.ok) {
      fetchPosts();
    } else {
      const error = await res.json();
      alert(error.message || 'Error adding post');
    }
  };

  const deletePost = async (id) => {
    const token = Cookies.get('token');
    const res = await fetch(`https://reschoolexpres.vercel.app/posts/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (res.ok) {
      fetchPosts();
    } else {
      alert('You can only delete your post.');
    }
  };

  const editPost = (post) => {
    setEditingPost(post);
    setEditingContent(post.content);
  };

  const updatePost = async (id, content) => {
    const token = Cookies.get('token');
    const res = await fetch(`https://reschoolexpres.vercel.app/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({ content }),
    });

    if (res.ok) {
      setEditingPost(null);
      setEditingContent('');
      fetchPosts();
    } else {
      alert('Error updating post');
    }
  };

  const logout = () => {
    Cookies.remove('token');
    navigate('/sign-in');
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold ml-[250px]">Dashboard</h2>
        <div className="flex justify-between items-center mb-4">
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2">
            Logout
          </button>
          {posts[0]?.author && (
            <p className="text-gray-700 ml-[50px] flex mr-[300px]">
              <strong>Email:</strong> {posts[0].author.email}
            </p>
          )}
        </div>
      </div>

      <div className="mb-4 ml-[250px]">
        <input
          type="text"
          placeholder="Search by Post ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="border px-2 py-1 mr-2"
        />
        <button
          onClick={searchPostById}
          className="bg-blue-500 text-white px-4 py-1"
        >
          Search
        </button>
      </div>

      <PostForm onAdd={addPost} />

      {searchResult && (
        <div className="border ml-[250px] mr-[250px] p-4 rounded-[10px] mt-4 bg-yellow-50">
          <h3 className="font-bold mb-2">Search Result</h3>
          {searchResult.notFound ? (
            <p className="text-red-500">არაფერი მოიძებნა</p>
          ) : (
            <>
              <p><strong>ID:</strong> {searchResult._id}</p>
              <p><strong>Content:</strong> {searchResult.content}</p>
              <p><strong>Author Email:</strong> {searchResult.author?.email}</p>
              <p><strong>Created At:</strong> {new Date(searchResult.createdAt).toLocaleString()}</p>
            </>
          )}
        </div>
      )}

      <ul className="flex ml-[200px] mr-[200px] flex-wrap">
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <li key={post._id} className="border ml-[50px] w-[400px] p-[20px] rounded-[10px] mt-[20px]">
              <div>
                <p><strong>ID:</strong> {post._id}</p>
                <p><strong>Content:</strong></p>
                {editingPost && editingPost._id === post._id ? (
                  <>
                    <input
                      type="text"
                      className="border p-1 w-full"
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                    />
                    <button
                      onClick={() => updatePost(post._id, editingContent)}
                      className="text-green-500 mt-2 mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingPost(null)}
                      className="text-gray-500 mt-2"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <p>{post.content}</p>
                )}
                <p><strong>Author Email:</strong> {post.author.email}</p>
                <p><strong>Created At:</strong> {new Date(post.createdAt).toLocaleString()}</p>
                <button onClick={() => deletePost(post._id)} className="text-red-500 mt-2">Delete</button>
                {post.author._id === userId && (
                  <button onClick={() => editPost(post)} className="text-blue-500 ml-2 mt-2">Edit</button>
                )}
              </div>
            </li>
          ))
        ) : (
          <li>No posts available.</li>
        )}
      </ul>
    </div>
  );
}
