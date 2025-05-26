import { useState, useEffect } from 'react';
import PostItem from '../components/PostItem';
import styles from '../style/Post.module.css';


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
    {list.map((item, index) => <PostItem key={index} data={item} />)}
    </ div>
  )
}
