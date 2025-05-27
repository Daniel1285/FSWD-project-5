import { use, useEffect, useState } from "react";
import styles from '../style/Post.module.css';
import { useNavigate } from 'react-router-dom';

export default function PostItem({ post, username }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={styles.postTitleRow}
        onClick={() => setExpanded((prev) => !prev)}
    >
      <div
      >
        <span className={styles.postTitle}>{post.title}</span>
        <span className={styles.postUser}>
          by {username}
        </span>
      </div>
      {expanded && (
        <div className={styles.postBody}>
          { post.body }
          <button
            className={styles.commentButton}
            onClick={e => {
              e.stopPropagation();
              navigate(`${post.id}`);
            }}
            title="View comments"
          >+</button>
        </div>
      )}
    </div>
  );
}