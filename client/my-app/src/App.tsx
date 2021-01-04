import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './main.css';
import NavBar from './components/NavBar';
import Homepage from './pages/Homepage';
import AdminPage from './pages/AdminPage';
import Login from './pages/Login';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route path="/" exact component={Homepage}></Route>
        <Route path="/admin" component={AdminPage}></Route>
        <Route path="/login" component={Login}></Route>
        <Route path="/profile" component={Profile}></Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
