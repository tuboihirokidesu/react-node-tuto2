import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { PropsWithChildren } from 'react';

export const myContext = createContext<any>({});
const Context = (props: PropsWithChildren<any>) => {
  const [user, setUser] = useState<any>();
  useEffect(() => {
    axios
      .get('http://localhost:4000/user', { withCredentials: true })
      .then((res) => {
        setUser(res.data);
      });
  }, []);
  return (
    <myContext.Provider value={user}>
      {/* 実際に配下のコンポーネントに渡したい値。通常、バケツリレーしていた値。 */}
      {props.children}
    </myContext.Provider>
  );
};

export default Context;
