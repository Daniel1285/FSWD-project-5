import { useEffect, useState } from "react";
import styles from '../style/items.module.css';

export default function Post({ data }) {
  const [post, setPost] = useState(data);
  const [comments, setComments] = useState([]);
  const [showComments, setshowComments] = useState(false);

  useEffect(() => {
    async function fetchComments() {
      const response = await fetch(`http://localhost:3001/comments?postId=${post.id}`);
      const comments = await response.json();
      console.log(comments);
      setComments(comments);
    }
    fetchComments();
  }, [])

  const handleClick = () => {
    console.log(showComments);
    setshowComments(!showComments);
  }

  return (
    <div onClick={handleClick} className={styles.container}>
      <p>{post.id}</p>
      <p>{post.title}</p>
      <div>
        {showComments && comments.map((item) => (
          <p key={item.id}>{JSON.stringify(item)}</p>
        ))}
      </div>
    </div>
  )
}
