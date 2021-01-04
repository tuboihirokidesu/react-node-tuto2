import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <div className="NavContainer">
      <Link to="/logout">Logout</Link>
      <Link to="/home">Home</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/admin">Admin</Link>
      <Link to="/login">Login</Link>
      <Link to="/home">Home</Link>
      <Link to="/resister">Resister</Link>
    </div>
  );
};

export default NavBar;
