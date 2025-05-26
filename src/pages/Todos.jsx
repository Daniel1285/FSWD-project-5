import { useState, useEffect } from 'react';
import TodoItem from '../components/TodoItem';
import styles from '../style/todos.module.css';

export default function Todos({ user }) {
  const [list, setList] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filter, setFilter] = useState({ id: '', title: '', status: 'all' });
  const url = `http://localhost:3001/todos?userId=${user.id}`;

  useEffect(() => {
    async function fetchList() {
      const response = await fetch(url);
      const resTodos = await response.json();
      setList(resTodos);
      setFilteredTodos(resTodos);
    }
    fetchList();
  }, []);

  useEffect(() => {
    const filtered = list.filter((todo) => {
      const matchesId = filter.id ? todo.id.toString().includes(filter.id) : true;
      const matchesTitle = filter.title
        ? todo.title.toLowerCase().includes(filter.title.toLowerCase())
        : true;
      const matchesStatus =
        filter.status === 'all'
          ? true
          : filter.status === 'completed'
          ? todo.completed
          : !todo.completed;

      return matchesId && matchesTitle && matchesStatus;
    });
    setFilteredTodos(filtered);
  }, [filter, list]);

  const handleAddTodo = async () => {
    if (!newTodoTitle.trim()) return;

    const newTodo = {
      userId: user.id,
      title: newTodoTitle,
      completed: false,
    };

    const response = await fetch('http://localhost:3001/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo),
    });

    const createdTodo = await response.json();
    setList((prevList) => [...prevList, createdTodo]);
    setNewTodoTitle('');
  };

  const handleDeleteTodo = async (id) => {
    await fetch(`http://localhost:3001/todos/${id}`, {
      method: 'DELETE',
    });

    setList((prevList) => prevList.filter((todo) => todo.id !== id));
  };

  const handleUpdateTodo = (updatedTodo) => {
    setList((prevList) =>
      prevList.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
    );
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
  };

  return (
    <div className={styles.comp}>
      <div className={styles.addTodo}>
        <input
          type="text"
          placeholder="New Todo"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
        />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>

      <div className={styles.filters}>
        <input
          type="text"
          name="id"
          placeholder="Filter by ID"
          value={filter.id}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="title"
          placeholder="Filter by Title"
          value={filter.title}
          onChange={handleFilterChange}
        />
        <select name="status" value={filter.status} onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {filteredTodos.map((item) => (
        <TodoItem
          key={item.id}
          data={item}
          onDelete={handleDeleteTodo}
          onUpdate={handleUpdateTodo}
        />
      ))}
    </div>
  );
}
