import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Info from './pages/info';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Todos from './pages/todos';
import Posts from './pages/Posts';
import Albums from './pages/Albums';


function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home/*" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/home/info" element={<Info />} />
        <Route path="/home/todos" element={<Todos/>} />
        <Route path="/home/posts" element={<Posts />} />
        <Route path="/home/albums" element={<Albums />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
