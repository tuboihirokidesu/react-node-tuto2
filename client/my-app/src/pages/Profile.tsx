import React, { useContext } from 'react';
import { myContext } from './Context';

const Profile = () => {
  const ctx = useContext(myContext);

  return <div>Current Logged In User {ctx.username}</div>;
};

export default Profile;
