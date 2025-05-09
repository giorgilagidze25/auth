import React from 'react';
import { Link } from 'react-router-dom';

export default function Homepage() {
  return (
    <div className="text-center p-10">
      <h1 className="text-3xl font-bold mb-6">Welcome</h1>
      <Link to="/sign-in" className="text-blue-500 mr-4">Sign In</Link>
      <Link to="/sign-up" className="text-blue-500">Sign Up</Link>
    </div>
  );
}
