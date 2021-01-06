import axios, { AxiosResponse } from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { myContext } from './Context';
import { UserTypes } from '../Interface/Types';

const AdminPage = () => {
  const ctx = useContext(myContext);

  const [data, setData] = useState<UserTypes[]>();
  const [selectedUser, setSelectedUser] = useState<string>();
  useEffect(() => {
    axios
      .get('http://localhost:4000/getallusers', {
        withCredentials: true,
      })
      .then((res: AxiosResponse) => {
        console.log(res.data);

        setData(
          res.data.filter((item: UserTypes) => {
            return item.username !== ctx.username;
          })
        );
      });
  }, [ctx]);

  if (!data) {
    return null;
  }
  console.log(data);
  let userId: string;
  const deleteUser = () => {
    data.forEach((item: any) => {
      if (item.username === selectedUser) {
        userId = item._id;
      }
    });
    axios.post(
      'http://localhost:4000/deleteuser',
      {
        id: userId!,
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
        {data.map((item: UserTypes, i: number) => {
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
