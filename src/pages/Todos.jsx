import { useState, useEffect } from 'react';
import Todo from '../components/Todo';
import styles from '../style/items.module.css';


export default function Todos({ user }) {
  const [list, setList] = useState([])
  const url =  `http://localhost:3001/todos?userId=${user.id}`;

  useEffect(() => {
    async function fetchList() {
      const response = await fetch(url);
      const resTodos = await response.json();
      //const todos = resTodos.map(obj => JSON.stringify(obj));
      //console.log(todos);
      setList(resTodos);
    }
    fetchList();
  }, [])

  return (
    <div className={styles.comp}>
    {list.map((item, index) => <Todo key={index} data={item} />)}
    </ div>
  )
}
