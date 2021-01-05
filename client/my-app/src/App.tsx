import React, { useContext } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './main.css';
import NavBar from './components/NavBar';
import Homepage from './pages/Homepage';
import AdminPage from './pages/AdminPage';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import { myContext } from './pages/Context';

function App() {
  const ctx = useContext(myContext);
  console.log(ctx);

  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route path="/" exact component={Homepage}></Route>
        {ctx ? (
          <>
            {/* {ctx.isAdmin ? (
              <Route path="/admin" component={AdminPage}></Route>
            ) : null}  バックエンド側で管理者かどうかを実装している。*/}
            <Route path="/admin" component={AdminPage}></Route>
            <Route path="/profile" component={Profile}></Route>
          </>
        ) : (
          <>
            <Route path="/login" component={Login}></Route>
            <Route path="/register" component={Register}></Route>
          </>
        )}
      </Switch>
    </BrowserRouter>
  );
}

export default App;
