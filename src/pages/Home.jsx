import { useNavigate } from 'react-router-dom';
import { getUserFromStorage, removeUserFromStorage } from '../utils/StorageControls';
import styles from '../style/home.module.css'; // we'll define this next

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
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Welcome, {user?.name || user?.username}!</h2>
        <button onClick={handleLogout} className={styles.logout}>Logout</button>
      </header>

      <nav className={styles.nav}>
        <button onClick={() => handleNavigate('info')}>Info</button>
        <button onClick={() => handleNavigate('todos')}>Todos</button>
        <button onClick={() => handleNavigate('posts')}>Posts</button>
        <button onClick={() => handleNavigate('albums')}>Albums</button>
      </nav>

      <div className={styles.content}>
        <p>Select an option above to get started.</p>
      </div>
    </div>
  );
}
