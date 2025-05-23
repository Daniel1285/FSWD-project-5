import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveUserToStorage } from '../utils/StorageControls';
import styles from '../style/login.module.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/users?username=${username}`);
      const users = await response.json();

      const user = users.find((u) => u.website === password);

      if (user) {
        console.log(user);
        saveUserToStorage(user);
        navigate('/home');
      } else {
        console.log("no user");
        setErrorMsg('Unauthorized: Incorrect username or password');
      }
    } catch (error) {
      setErrorMsg('Error connecting to server. Please try again later.');
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleLogin}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Login</h2>
        {errorMsg && <div className={styles.error}>{errorMsg}</div>}

        <input
          className={styles.input}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className={styles.button}>Login</button>

        <p style={{ textAlign: 'center', fontSize: '0.9rem', marginTop: '1rem' }}>
          Don't have an account? <a href="/register" style={{ color: 'var(--primary-color)' }}>Register</a>
        </p>
      </form>
    </div>
  );
}
