import axios, { AxiosResponse } from 'axios';
import React, { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const login = () => {
    axios
      .post(
        'http://localhost:4000/login',
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      )
      .then(
        (res: AxiosResponse) => {
          if (res.data === 'success') {
            window.location.href = '/';
          }
        },
        () => {
          console.log('Failure'); //失敗した場合
        }
      );
  };
  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>login</button>
    </div>
  );
};

export default Login;
