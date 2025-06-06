import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUserId, setEditUserId] = useState(null);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      const token = Cookies.get('token');
      const res = await fetch('https://reschoolexpres.vercel.app/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        toast.error('Failed to fetch users');
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const token = Cookies.get('token');
    const confirmDelete = confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    const toastId = toast.loading('Deleting user...');

    try {
      const res = await fetch(`https://reschoolexpres.vercel.app/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== id));
        toast.update(toastId, {
          render: 'User deleted successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (err) {
      toast.update(toastId, {
        render: err.message,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleUpdate = async (id) => {
    const token = Cookies.get('token');

    const toastId = toast.loading('Updating user...');

    try {
      const res = await fetch(`https://reschoolexpres.vercel.app/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedData),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUsers((prev) =>
          prev.map((user) => (user._id === id ? updatedUser : user))
        );
        setEditUserId(null);
        setEditedData({});
        toast.update(toastId, {
          render: 'User updated successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        throw new Error('Failed to update user');
      }
    } catch (err) {
      toast.update(toastId, {
        render: err.message,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const goBack = () => {
    window.history.back();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <button
        onClick={goBack}
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go Back
      </button>

      <h2 className="text-2xl font-bold mb-6">Registered Users</h2>

      {users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">Full Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">User ID</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="text-center">
                  {editUserId === user._id ? (
                    <>
                      <td className="border px-4 py-2">
                        <input
                          type="text"
                          defaultValue={user.fullName}
                          onChange={(e) =>
                            setEditedData((prev) => ({
                              ...prev,
                              fullName: e.target.value,
                            }))
                          }
                          className="border p-1 w-full"
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          type="text"
                          defaultValue={user.email}
                          onChange={(e) =>
                            setEditedData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          className="border p-1 w-full"
                        />
                      </td>
                      <td className="border px-4 py-2 text-gray-500">{user._id}</td>
                      <td className="border px-4 py-2 space-x-2">
                        <button
                          onClick={() => handleUpdate(user._id)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditUserId(null)}
                          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border px-4 py-2">{user.fullName}</td>
                      <td className="border px-4 py-2">{user.email}</td>
                      <td className="border px-4 py-2 text-gray-500">{user._id}</td>
                      <td className="border px-4 py-2 space-x-2">
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => {
                            setEditUserId(user._id);
                            setEditedData({
                              email: user.email,
                              fullName: user.fullName,
                            });
                          }}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No registered users found.</p>
      )}
    </div>
  );
}
