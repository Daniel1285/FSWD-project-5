import React, { useState } from 'react';
import { getUserFromStorage, saveUserToStorage } from '../utils/StorageControls';
import styles from '../style/info.module.css';

export default function Info() {
  const [user, setUser] = useState(getUserFromStorage());
  const [name, setName] = useState(user?.name || '');
  const [image, setImage] = useState(user?.image || '');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    const updatedUser = { ...user, name, image };

    try {
      const response = await fetch(`http://localhost:3001/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) throw new Error('Update failed');

      const savedUser = await response.json();
      saveUserToStorage(savedUser);
      setUser(savedUser);
      setIsEditing(false);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Failed to update profile. Try again.');
    }
  };

  return (
    <div className={styles.container}>
      <h2>User Information</h2>

      <img src={image} alt="User" className={styles.avatar} />

      {isEditing ? (
        <>
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
          />
          <input
            className={styles.input}
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Image URL"
          />
          <button className={styles.save} onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Full Name:</strong> {user.name || 'Not set'}</p>
          <button className={styles.edit} onClick={() => setIsEditing(true)}>Edit Profile</button>
        </>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}
