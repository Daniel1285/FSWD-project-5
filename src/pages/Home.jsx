import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { getUserFromStorage, removeUserFromStorage } from '../utils/StorageControls';
import styles from '../style/home.module.css'; // we'll define this next
import Info from './Info';
import Todos from './Todos';
import Posts from './Posts';
import Albums from './Albums';
import { HomeLayout } from '../HomeLayout';
import { ThingsList } from '../components/ThingsList';
import Todo from '../components/Todo';

export default function Home() {
  const navigate = useNavigate();
  const user = getUserFromStorage();

  const handleLogout = () => {
    removeUserFromStorage();
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(`/home/${path}`);
  };

  return (
    <>
      <HomeLayout />
      <Routes>
        <Route path="info" element={<Info />} />
        <Route path="todos" element={<ThingsList url={`http://localhost:3001/todos?userId=${user.id}`} Item={Todo}/>} />
        <Route path="todos1" element={<Todos user={user}/>} />
        <Route path="posts" element={<Posts />} />
        <Route path="albums" element={<Albums />} />
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
      </Routes>

    </>
  );
}
