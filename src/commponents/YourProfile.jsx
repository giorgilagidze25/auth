import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function YourProfile() {
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          navigate('/dashboard');
          return;
        }

        const res = await fetch('https://reschoolexpres.vercel.app/auth/current-user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch user');

        const data = await res.json();
        setUser(data);
        setFullName(data.fullName);
        setEmail(data.email);
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
      alert('Your avatar has been successfully updated!');
    } catch (error) {
      console.error('Error uploading avatar:', error.message);
      alert('Failed to upload avatar. Please try again later.');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    const token = Cookies.get('token');

    try {
      setUpdating(true);
      const res = await fetch('https://reschoolexpres.vercel.app/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName, email }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Update failed: ${errorText}`);
      }

      const updatedUser = await res.json();
      setUser(updatedUser);
      setEditMode(false);
      alert('Your profile has been updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile. Please check your input and try again.');
    } finally {
      setUpdating(false);
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

          <div className="space-y-4 text-gray-700 flex-col flex justify-center items-center">
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

            <div className="w-full space-y-2">
              {editMode ? (
                <>
                  <label className="block font-semibold">Full Name:</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />

                  <label className="block font-semibold">Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />

                  <button
                    onClick={handleUpdateProfile}
                    className="mt-4 bg-green-500 ml-[120px] hover:bg-green-600 text-white px-4 py-2 rounded-md shadow-md"
                    disabled={updating}
                  >
                    {updating ? 'Updating...' : 'Save Changes'}
                  </button>
                </>
              ) : (
<div className="w-full flex flex-col items-center justify-center text-center rounded-xl p-6">
            <p className="text-sm text-gray-500 mt-2">
              <span className="font-semibold">ID:</span> {user._id}
            </p>
  <p className="text-lg text-gray-700">
    <span className="font-semibold text-gray-800">Full Name:</span> {user.fullName}
  </p>
  <p className="text-lg text-gray-700 mt-1">
    <span className="font-semibold text-gray-800">Email:</span> {user.email}
  </p>

  <button
    onClick={() => setEditMode(true)}
    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-all"
  >
    Edit Profile
  </button>
</div>
              )}
            </div>

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
