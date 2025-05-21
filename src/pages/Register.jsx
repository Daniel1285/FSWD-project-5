import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../style/login.module.css'; // reuse login styles
import { saveUserToStorage } from '../utils/StorageControls';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== verifyPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/users?username=${username}`);
      const existingUsers = await res.json();

      if (existingUsers.length > 0) {
        setErrorMsg("Username already exists");
        return;
      }

      const newUser = {
        username,
        website: password, 
        name: "", 
        email: "",
        image: "https://via.placeholder.com/150"
      };

      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      const createdUser = await response.json();
      saveUserToStorage(createdUser);
      navigate('/home');

    } catch (err) {
      setErrorMsg("Registration failed. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleRegister}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Register</h2>
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

        <input
          className={styles.input}
          type="password"
          placeholder="Verify Password"
          value={verifyPassword}
          onChange={(e) => setVerifyPassword(e.target.value)}
          required
        />

        <button type="submit" className={styles.button}>Register</button>
      </form>
    </div>
  );
}
