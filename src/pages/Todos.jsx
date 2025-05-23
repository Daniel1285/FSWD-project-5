import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveUserToStorage } from '../utils/StorageControls';

export function Todos({ user }) {
  const [todos, setTodos] = useState([])
  useEffect(() => {
    async function fetchTodos(userId) {
      console.log(userId);
      const response = await fetch(`http://localhost:3001/todos?userId=${userId}`);
      const resTodos = await response.json();
      //const todos = resTodos.map(obj => JSON.stringify(obj));
      //console.log(todos);
      setTodos(resTodos);
    }
    fetchTodos(user.id);
  }, [])

  const handleCheckBoxChanged = (id) => {
    const updatedTodos = todos.map(todo => 
      id === todo.id ? {...todo, completed: !todo.completed} : todo
    );
    console.log(updatedTodos);
    setTodos(updatedTodos);
  }

  return (
    <ul>
      {
        todos.map(todo => <li key={todo.id}>
          <h3>{todo.id}</h3>
          <p>{todo.title}</p>
          <input
            type='checkbox'
            checked={todo.completed}
            onChange={() => handleCheckBoxChanged(todo.id)}
          />
        </li>)
      }
    </ul>
  )
}

export default Todos;
