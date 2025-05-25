import { useState, useEffect } from 'react';
import Post from '../components/Post';
import styles from '../style/items.module.css';


export default function Posts({ user }) {
  const [list, setList] = useState([])
  const url =  `http://localhost:3001/posts?userId=${user.id}`;

  useEffect(() => {
    async function fetchList() {
      const response = await fetch(url);
      const resPosts = await response.json();
      setList(resPosts);
    }
    fetchList();
  }, [])

  return (
    <div className={styles.comp}>
    {list.map((item, index) => <Post key={index} data={item} />)}
    </ div>
  )
}
