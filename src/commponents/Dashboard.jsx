import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import PostForm from './PostForm';
import { toast } from 'react-toastify';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  
  const navigate = useNavigate();

  const fetchPosts = async () => {
    const token = Cookies.get('token');
    const res = await fetch('https://reschoolexpres.vercel.app/posts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
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

  const likePost = async (postId) => {
    const token = Cookies.get('token');
    const res = await fetch(`https://reschoolexpres.vercel.app/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      fetchPosts(); 
    } else {
      toast.error('Failed to like post.');
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
    });

    if (res.ok) {
      const data = await res.json();
      setSearchResult(data);
    } else {
      setSearchResult({ notFound: true });
    }
  };
const addPost = async (content, imageFile) => {
  const token = Cookies.get('token');
  const formData = new FormData();
  formData.append('content', content);
  if (imageFile) {
    formData.append('image', imageFile);
  }

  const res = await fetch('https://reschoolexpres.vercel.app/posts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`, 
    },
    body: formData,
  });

  if (res.ok) {
    fetchPosts();
    toast.success('Post added successfully');
  } else {
    const error = await res.json();
    toast.error(error.message || 'Error adding post');
  }
};


  const deletePost = async (id) => {
    const token = Cookies.get('token');
    const res = await fetch(`https://reschoolexpres.vercel.app/posts/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      fetchPosts();
      toast.success('Post deleted successfully');
    } else {
      toast.error('You can only delete your post.');
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
      body: JSON.stringify({ content }),
    });

    if (res.ok) {
      setEditingPost(null);
      setEditingContent('');
      fetchPosts();
      toast.success('Post updated successfully');
    } else {
      toast.error('Error updating post');
    }
  };

  const logout = () => {
    Cookies.remove('token');
    navigate('/sign-in');
  };

  useEffect(() => {
  const token = Cookies.get('token');
  if (!token) {
    navigate('/sign-in');
    return;
  }

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('https://reschoolexpres.vercel.app/auth/current-user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch current user');
      const data = await res.json();
      setUser(data);  
    } catch (error) {
      console.error(error);
      Cookies.remove('token');
      navigate('/sign-in');
    }
  };

  fetchCurrentUser();

  fetchPosts();

  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  setIsAdmin(decodedToken.role === 'admin');
}, []);


const dislikePost = async (postId) => {
  const token = Cookies.get('token');
  const res = await fetch(`https://reschoolexpres.vercel.app/posts/${postId}/dislike`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.ok) {
    fetchPosts();
  } else {
    toast.error('Failed to dislike post.');
  }
};


const fetchSortedPosts = async (sortType) => {
  const token = Cookies.get('token');

  let url = 'https://reschoolexpres.vercel.app/posts'; 
  if (sortType === 'most') {
    url += '?type=most';
  } else if (sortType === 'least') {
    url += '?type=least';
  }

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      setPosts(data);
    } else {
      toast.error('Failed to fetch sorted posts.');
    }
  } catch (error) {
    console.error(error);
    toast.error('Something went wrong while sorting posts.');
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <div className="flex items-center space-x-4">
           {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              Admin Panel
            </button>
          )}
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>

        <div className='w-full flex flex-col p-2'>
         <Link to="/profile" className="text-blue-600 flex-col flex justify-center items-center ">
  <img
    className="rounded-full w-[50px] h-[50px]"
    src={user?.avatar || 'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg'}
    alt="User Avatar"
  />
  Profile
</Link>

          </div>  
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search by Post ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={searchPostById}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Search
          </button>


            <select
      onChange={(e) => fetchSortedPosts(e.target.value)}
      className="border border-gray-300 p-2 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Sort by</option>
      <option value="most">Most Liked</option>
      <option value="least">Most Disliked</option>
    </select>
        </div>
      </div>

      <PostForm onAdd={addPost} />

      {searchResult && (
        <div className="bg-yellow-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2 text-lg">Search Result</h3>
          {searchResult.notFound ? (
            <p className="text-red-500">No post found</p>
          ) : (
            <div>
              <p>
                <strong>ID:</strong> {searchResult._id}
              </p>
              <p>
                <strong>Content:</strong> {searchResult.content}
              </p>
              <p>
                <strong>Author Email:</strong> {searchResult.author?.email}
              </p>
              <p>
                <strong>Created At:</strong>{' '}
                {new Date(searchResult.createdAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      )}
<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {Array.isArray(posts) && posts.length > 0 ? (
    posts.map((post) => (
      <li
        key={post._id}
        className="group bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition relative"
      >
        <div>
          <p>
            <strong>ID:</strong> {post._id}
          </p>
          <p>
            <strong>Content:</strong>
          </p>
          {editingPost && editingPost._id === post._id ? (
            <>
              <input
                type="text"
                className="border p-2 w-full mt-2"
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
              />
              <div className="flex justify-end space-x-4 mt-2">
                <button
                  onClick={() => updatePost(post._id, editingContent)}
                  className="text-green-600 hover:underline"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingPost(null)}
                  className="text-gray-500 hover:underline"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <p>{post.content}</p>
          )}

          {post.image && (
            <img
                src={post.image} 
              alt="Post image"
              className="mt-4 max-h-48 object-cover rounded-md"
            />
          )}

          <p>
            <strong>Author Email:</strong> {post.author.email}
          </p>
          <p>
            <strong>Created At:</strong>{' '}
            {new Date(post.createdAt).toLocaleString()}
          </p>

<div className="flex items-center space-x-3 mt-4">
  <span onClick={() => likePost(post._id)} className="cursor-pointer flex items-center space-x-1">
    <ThumbsUp size={18} />
    <span>{post.likes ? post.likes.length : 0}</span>
  </span>
  <span onClick={() => dislikePost(post._id)} className="cursor-pointer  flex items-center space-x-1">
    <ThumbsDown size={18} />
    <span>{post.dislikes ? post.dislikes.length : 0}</span>
  </span>
</div>



          {(post.author._id === userId || isAdmin) && (
            <div className="flex space-x-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={() => deletePost(post._id)}
                className="text-white w-[100px] h-[40px] bg-red-500 rounded-[20px] hover:bg-red-600"
              >
                X
              </button>
              <button
                onClick={() => editPost(post)}
                className="text-white w-[100px] h-[40px] bg-blue-500 rounded-[20px] hover:bg-blue-600 hover:underline"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </li>
    ))
  ) : (
    <li className="text-center text-gray-500">No posts available.</li>
  )}
</ul>
    </div>
  );
}
