import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function YourProfile() {
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get('token');

        const res = await fetch('https://reschoolexpres.vercel.app/auth/current-user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch user');

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
        navigate('/dashboard');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleUploadAvatar = async (e) => {
    const token = Cookies.get('token');
    const files = e.target.files;

    if (!files.length) return;

    const formData = new FormData();
    formData.append('avatar', files[0]);

    try {
      setUploading(true);
      const resp = await fetch('https://reschoolexpres.vercel.app/users', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!resp.ok) {
        const errorText = await resp.text();
        throw new Error(`Server responded with ${resp.status}: ${errorText}`);
      }

      const updatedUser = await resp.json();
      setUser(updatedUser);
      console.log('Avatar updated successfully:', updatedUser);
    } catch (error) {
      console.error('Error uploading avatar:', error.message);
      alert('ატვირთვა ვერ მოხერხდა: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex justify-center bg-gradient-to-br from-gray-100 to-white px-4">
      <button
        onClick={handleBack}
        className="absolute top-5 left-5 p-2 bg-blue-500 text-white rounded-md shadow-md"
      >
        &#8592; Back
      </button>

      {user ? (
        <div className="w-full max-w-md mt-[100px] bg-white shadow-2xl rounded-2xl p-8 space-y-4 border border-gray-200 transition-all">
          <h1 className="text-3xl font-extrabold text-gray-800 text-center">Your Profile</h1>
          <div className="space-y-2 text-gray-700 flex-col flex justify-center items-center">
            <img
              src={user?.avatar || 'https://via.placeholder.com/100'}
              alt="User Avatar"
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <label htmlFor="avatar" className="cursor-pointer text-blue-500 underline">
                {uploading ? 'Uploading...' : 'Upload img'}
              </label>
              <input
                onChange={handleUploadAvatar}
                type="file"
                id="avatar"
                className="hidden"
                accept="image/*"
              />
            </div>
            <p><span className="font-semibold">ID:</span> {user._id}</p>
            <p><span className="font-semibold">Full Name:</span> {user.fullName}</p>
            <p><span className="font-semibold">Email:</span> {user.email}</p>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <p className="text-gray-500 text-lg mt-[100px] text-[40px]">Loading profile...</p>
        </div>
      )}
    </div>
  );
}
