import {useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TodoItem from '../components/TodoItem';
import styles from '../style/todos.module.css';

export default function Todos() {
  const { userId } = useParams();
  const [list, setList] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const newTodoTitle = useRef();
  const [filter, setFilter] = useState({ id: '', title: '', status: 'all' });
  const [sortBy, setSortBy] = useState('default');
  const url = `http://localhost:3001/todos?userId=${userId}`;

  useEffect(() => {
    async function fetchList() {
      try {
        const response = await fetch(url);
        const resTodos = await response.json();
        setList(resTodos);
        setFilteredTodos(resTodos);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
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
    if (!newTodoTitle.current.value.trim()) return;

    const newTodo = {
      userId: userId,
      title: newTodoTitle.current.value,
      completed: false,
    };

    try {
      const response = await fetch('http://localhost:3001/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo),
      });

      const createdTodo = await response.json();
      setList((prevList) => [...prevList, createdTodo]);
      newTodoTitle.current.value = '';
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:3001/todos/${id}`, {
        method: 'DELETE',
      });
      setList((prevList) => prevList.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
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

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'completed') {
      return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
    }
    if (sortBy === 'id') {
      return a.id - b.id;
    }
    return 0;
  });

  return (
    <div className={styles.comp}>
      <div className={styles.addTodo}>
        <input
          type="text"
          placeholder="New Todo"
          ref={newTodoTitle}
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
        <div>
          <label>Sort by: </label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="default">Default</option>
            <option value="title">Title</option>
            <option value="completed">Completed</option>
            <option value="id">Id</option>
          </select>
        </div>
      </div>

      {sortedTodos.map((item) => (
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
