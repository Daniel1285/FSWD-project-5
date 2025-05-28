import { useEffect, useReducer, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../style/login.module.css'; // reuse login styles
import { saveUserToStorage } from '../utils/StorageControls';

export default function Register() {
  //const [username, setUsername] = useState('');
  const usernameRef = useRef();
  const nameRef = useRef();
  const emailRef = useRef();
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    //set error message to password mismatch if passwords do not match
    if (password && verifyPassword && password !== verifyPassword) {
      setErrorMsg("Passwords do not match");
    } else {
      setErrorMsg('');
    }
  }, [password, verifyPassword]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== verifyPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    try {
      const name = nameRef.current.value;
      const username = usernameRef.current.value;
      const email = emailRef.current.value;
      console.log("Username:", username);
      const res = await fetch(`http://localhost:3001/users?username=${username}`);
      console.log(res);
      const existingUsers = await res.json();
      console.log("Existing Users:", existingUsers, "Length: ", existingUsers.length);


      console.log("here 1");

      if (existingUsers.length > 0) {
        setErrorMsg("Username already exists");
        return;
      }

      const countRes = await fetch('http://localhost:3001/userCount');
      const countData = await countRes.json();
      console.log("Count Data:", countData);
      const myID = countData.count + 1; // Assuming IDs are sequential and start from 1

      // pur to update userCount
      await fetch('http://localhost:3001/userCount', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: myID })
      });

      const newUser = {
        id: myID,
        name: name,
        username: username,
        website: password,
        email: email,
        address: null,
        phone: null,
        company: null,
        image: "https://png.pngtree.com/png-vector/20240715/ourmid/pngtree-man-profile-icon-silhouette-of-businessman-face-profile-vector-png-image_7058983.png"
      };

      console.log("here 2");
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      console.log("here 3");

      const createdUser = await response.json();
      saveUserToStorage(createdUser);
      navigate('/home/users/' + createdUser.id);
      console.log("here 4");

    } catch (err) {
      setErrorMsg("Registration failed. Please try again.");
      console.log(err);
      console.error(err);
      
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
          placeholder="Full Name"
          ref={nameRef}
          //value={username}
          //onChange={(e) => setUsername(e.target.value)}
        />
        
        <input
          className={styles.input}
          type="text"
          placeholder="Username"
          ref={usernameRef}
          //value={username}
          //onChange={(e) => setUsername(e.target.value)}
        />
        
        <input
          className={styles.input}
          type="email"
          placeholder="Email"
          ref={emailRef}
          //value={username}
          //onChange={(e) => setUsername(e.target.value)}
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
