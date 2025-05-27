import { useState, useEffect } from 'react';
import styles from '../style/comments.module.css';

export default function PostComments({ postId }) {
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editBody, setEditBody] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    async function fetchComments() {
      const res = await fetch(`http://localhost:3001/comments?postId=${postId}`);
      setComments(await res.json());
    }
    fetchComments();
  }, [postId]);

  const refreshComments = async () => {
    const res = await fetch(`http://localhost:3001/comments?postId=${postId}`);
    setComments(await res.json());
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentBody.trim()) return;
    setSubmitting(true);
    await fetch('http://localhost:3001/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postId: Number(postId),
        name: user?.username || 'Anonymous',
        email: user?.email || '',
        body: commentBody,
      }),
    });
    setCommentBody('');
    setSubmitting(false);
    await refreshComments();
  };

  const handleDeleteComment = async (id) => {
    await fetch(`http://localhost:3001/comments/${id}`, { method: 'DELETE' });
    await refreshComments();
  };

  const handleEditComment = (comment) => {
    setEditingId(comment.id);
    setEditBody(comment.body);
  };

  const handleSaveEdit = async (comment) => {
    await fetch(`http://localhost:3001/comments/${comment.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: editBody , email: comment.email, name: comment.name }),
    });
    setEditingId(null);
    setEditBody('');
    await refreshComments();
  };

  const isUserComment = (comment) =>
    user &&
    ((comment.name && comment.name === user.username) ||
      (comment.email && comment.email === user.email));

  return (
    <div className={styles.thread}>
      <form onSubmit={handleAddComment} className={styles.addCommentForm}>
        <textarea
          placeholder="Add a comment..."
          value={commentBody}
          onChange={e => setCommentBody(e.target.value)}
          rows={2}
          required
        />
        <button type="submit" disabled={submitting || !commentBody.trim()}>
          {submitting ? "Adding..." : "Add Comment"}
        </button>
      </form>
      {comments.map((item) => (
        <div key={item.id} className={styles.comment}>
          <span className={styles.commentName}>{item.name}</span>
          <span className={styles.commentEmail}> @{item.email}</span>
          {editingId === item.id ? (
            <>
              <textarea
                value={editBody}
                onChange={e => setEditBody(e.target.value)}
                rows={2}
                className={styles.input}
              />
              <button onClick={() => handleSaveEdit(item)} style={{marginRight: 8}}>Save</button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </>
          ) : (
            <div className={styles.commentBody}>{item.body}</div>
          )}
          {isUserComment(item) && editingId !== item.id && (
            <div style={{ marginTop: 4 }}>
              <button onClick={() => handleEditComment(item)} style={{marginRight: 8}}>Edit</button>
              <button onClick={() => handleDeleteComment(item.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}