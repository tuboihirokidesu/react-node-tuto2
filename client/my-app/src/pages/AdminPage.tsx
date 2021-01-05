import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { myContext } from './Context';

const AdminPage = () => {
  const ctx = useContext(myContext);
  console.log(ctx);

  const [data, setData] = useState<any>();
  const [selectedUser, setSelectedUser] = useState<string>();
  useEffect(() => {
    axios
      .get('http://localhost:4000/getallusers', {
        withCredentials: true,
      })
      .then((res: any) => {
        console.log(res.data);

        setData(
          res.data.filter((item: any) => {
            return item.username !== ctx.username;
          })
        );
      });
  }, []);

  if (!data) {
    return null;
  }
  console.log(data);
  let userId: any;
  const deleteUser = () => {
    data.forEach((item: any) => {
      if (item.username === selectedUser) {
        userId = item._id;
      }
    });
    axios.post(
      'http://localhost:4000/deleteuser',
      {
        id: userId,
      },
      {
        withCredentials: true,
      }
    );
  };

  return (
    <div>
      <h1>Admin Page,Only Admin's Can See This</h1>
      <select
        onChange={(e) => setSelectedUser(e.target.value)}
        name="deleteuser"
        id="deleteuser"
      >
        <option id="Select a user">Select a User</option>
        {data.map((item: any, i: number) => {
          return (
            <option key={i} id={item.username}>
              {item.username}
            </option>
          );
        })}
      </select>
      <button onClick={deleteUser}>Delete User</button>
    </div>
  );
};

export default AdminPage;
