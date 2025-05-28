import { useState } from 'react';
import styles from '../style/todos.module.css';

export default function Todo({ data, onDelete, onUpdate }) {
  const [todo, setTodo] = useState(data);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleCheckBoxChanged = async () => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    setTodo(updatedTodo);
    try {
      await fetch(`http://localhost:3001/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo),
      });
      onUpdate(updatedTodo);
    } catch (error) {
      console.error('Error updating todo status:', error);
    }
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const handleSaveEdit = async () => {
    const updatedTodo = { ...todo, title: editTitle };
    setTodo(updatedTodo);
    setIsEditing(false);
    try {
      await fetch(`http://localhost:3001/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo),
      });
      onUpdate(updatedTodo);
    } catch (error) {
      console.error('Error saving edited todo:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h3>{todo.id}</h3>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleCheckBoxChanged}
      />
      {isEditing ? (
        <>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <button onClick={handleSaveEdit}>Save</button>
        </>
      ) : (
        <>
          <p>{todo.title}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </>
      )}
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
