import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Info from './pages/Info';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Todos from './pages/Todos';
import Posts from './pages/Posts';
import Albums from './pages/Albums';
import styles from './style/home.module.css'; // we'll define this next
import { HomeLayout } from './HomeLayout';


function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path={`/home/*`} element={<Home />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
