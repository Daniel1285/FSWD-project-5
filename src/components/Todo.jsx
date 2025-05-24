import { useState } from "react";
import styles from '../style/items.module.css';

export default function Todo({ data }) {
  const [todo, setTodo] = useState(data);

  const handleCheckBoxChanged = () => {
    const newTodo = { ...todo, completed: !todo.completed };
    setTodo(newTodo);
    console.log(newTodo);
    async function fetchTodos() {
      const response = await fetch(`http://localhost:3001/todos/${newTodo.id}`, {
        method: "put",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTodo)
      });
      const success = await response.text();
      console.log(success);
    }
    fetchTodos();
    /*const updatedTodos = todos.map(todo => 
      id === todo.id ? {...todo, completed: !todo.completed} : todo
    );
    console.log(updatedTodos);
    setTodos(updatedTodos);
    */
  }

  return (
    <div className={styles.container}>
      <h3>{todo.id}</h3>
      <input
        type='checkbox'
        checked={todo.completed}
        onChange={handleCheckBoxChanged} />
      <p>{todo.title}</p>
    </div>
  )
}
