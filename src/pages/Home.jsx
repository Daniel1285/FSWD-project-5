import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { getUserFromStorage, removeUserFromStorage } from '../utils/StorageControls';
import styles from '../style/home.module.css';
import Info from './Info';
import Todos from './Todos';
import Posts from './Posts';
import Albums from './Albums';
import { Navbar } from '../components/Navbar';
import AlbumList from '../components/AlbumList';

export default function Home() {
  const navigate = useNavigate();
  const user = getUserFromStorage();

  const handleLogout = () => {
    removeUserFromStorage();
    navigate('/login');
  };

  return (
    <>
      <Navbar userId={user.id}/>
      <Routes>
        <Route path="users/:userId">
          <Route path="info" element={<Info />} />
          <Route path="todos" element={<Todos />} />
          <Route path="albums" element={<Albums />} />
          <Route path="albums/:albumId" element={<AlbumList />} />
          <Route path="posts/*" element={<Posts />} />
          <Route index element={
            <div className={styles.container}>
              <header className={styles.header}>
                <h2>Welcome, {user?.name || user?.username}!</h2>
                <button onClick={handleLogout} className={styles.logout}>Logout</button>
              </header>
              <div className={styles.content}>
                <p>Select an option above to get started.</p>
              </div>
            </div>
          } />
        </Route>
      </Routes>
    </>
  );
}
