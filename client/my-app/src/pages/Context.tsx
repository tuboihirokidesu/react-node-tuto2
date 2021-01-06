import axios, { AxiosResponse } from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { PropsWithChildren } from 'react';
import { UserTypes } from '../../../../backend/src/Interface/UserTypes';

export const myContext = createContext<Partial<UserTypes>>({}); //Partial<T> …… T のプロパティをすべて省略可能にする
const Context = (props: PropsWithChildren<any>) => {
  const [user, setUser] = useState<UserTypes>();
  useEffect(() => {
    axios
      .get('http://localhost:4000/user', { withCredentials: true })
      .then((res: AxiosResponse) => {
        setUser(res.data);
      });
  }, []);
  return (
    <myContext.Provider value={user!}>
      {/* 実際に配下のコンポーネントに渡したい値。通常、バケツリレーしていた値。 */}
      {props.children}
    </myContext.Provider>
  );
};

export default Context;
