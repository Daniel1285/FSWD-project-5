import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from '../style/Post.module.css';
import PostComments from '../components/PostComments';

export default function PostDetail() {
  const { postId, userId } = useParams();
  const navigate = useNavigate();
  const isNew = postId === "new";
  const [post, setPost] = useState(isNew ? { title: '', body: '' } : null);
  const [user, setUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(isNew);

  useEffect(() => {
    if (!isNew) {
      async function fetchPostAndUser() {
        const res = await fetch(`http://localhost:3001/posts/${postId}`);
        const data = await res.json();
        setPost(data);
        // Fetch the actual author, not the current user
        const userRes = await fetch(`http://localhost:3001/users/${data.userId}`);
        setUser(await userRes.json());
      }
      fetchPostAndUser();
    } else {
      // For new post, show current user as author
      async function fetchCurrentUser() {
        const res = await fetch(`http://localhost:3001/users/${userId}`);
        setUser(await res.json());
      }
      fetchCurrentUser();
    }
  }, [postId, userId, isNew]);

  const handleSavePost = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (isNew) {
      const res = await fetch('http://localhost:3001/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...post, userId: Number(userId) }),
      });
      const newPost = await res.json();
      setSubmitting(false);
      navigate(`/home/users/${userId}/posts/${newPost.id}`);
    } else {
      await fetch(`http://localhost:3001/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      setSubmitting(false);
      setEditing(false);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className={styles.blogContainer}>
      <form onSubmit={handleSavePost}>
        <div className={styles.blogHeader}>
          {editing ? (
            <input
              className={styles.editTitle}
              type="text"
              value={post.title}
              onChange={e => setPost({ ...post, title: e.target.value })}
              placeholder="Title"
              required
              autoFocus
            />
          ) : (
            <h2 className={styles.blogTitle}>{post.title}</h2>
          )}
          {user && !editing && <span className={styles.blogUser}>by {user.username}</span>}
        </div>
        <div className={styles.blogBody}>
          {editing ? (
            <textarea
              className={styles.editBody}
              value={post.body}
              onChange={e => setPost({ ...post, body: e.target.value })}
              placeholder="Body"
              rows={6}
              required
            />
          ) : (
            post.body
          )}
        </div>
        {editing && (
          <button
            type="submit"
            className={styles.savePostButton}
            disabled={submitting || !post.title.trim() || !post.body.trim()}
          >
            {submitting ? (isNew ? "Creating..." : "Saving...") : (isNew ? "Create Post" : "Save Changes")}
          </button>
        )}
      </form>
      {!isNew && !editing && (
        <button
          className={styles.editPostButton}
          onClick={() => setEditing(true)}
          style={{ marginBottom: '1rem' }}
        >
          Edit Post
        </button>
      )}
      {!isNew && <PostComments postId={postId}/>}
    </div>
  );
}