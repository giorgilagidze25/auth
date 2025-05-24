import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = Cookies.get('token');
      const res = await fetch('https://reschoolexpres.vercel.app/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <button 
        onClick={goBack} 
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go Back
      </button>
      
      <h2 className="text-2xl font-bold mb-6">Registered Users</h2>
      
      <ul>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user._id} className="mb-2 p-2 bg-white rounded shadow">
              <strong>Email: {user.email}</strong> 
              <strong className='ml-[30px]'>ID: {user._id}</strong>
              <strong className='ml-[30px]'>FullName: {user.fullName}</strong> 
            </li>
          ))
        ) : (
          <p>No registered users found.</p>
        )}
      </ul>
    </div>
  );
}
