import { useState } from "react";

export default function Todo({ data }) {
  const [todo, setTodo] = useState(data);

  const handleCheckBoxChanged = () => {
    setTodo({...todo, completed: !todo.completed})
    /*const updatedTodos = todos.map(todo => 
      id === todo.id ? {...todo, completed: !todo.completed} : todo
    );
    console.log(updatedTodos);
    setTodos(updatedTodos);
    */
  }

  return (
    <>
      <h3>{todo.id}</h3>
      <p>{todo.title}</p>
      <input
        type='checkbox'
        checked={todo.completed}
        onChange={handleCheckBoxChanged}/>
    </>
  )
}
