import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import styles from '../style/Post.module.css';
import PostDetail from './PostDetail';
import PostItem from '../components/PostItem';
import { getUserFromStorage } from '../utils/StorageControls'; // adjust path as needed

export default function Posts() {
  const { userId, postId } = useParams();
  const isPostDetail = /\/posts\/\d+$/.test(window.location.pathname);
  console.log('postid: ', postId, ' isPostDetail:', isPostDetail);
  const currentUserId = userId || getUserFromStorage()?.id;
  const [PostList, setPostList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [userFilter, setUserFilter] = useState(currentUserId ? String(currentUserId) : '');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const postsRes = await fetch('http://localhost:3001/posts');
        const posts = await postsRes.json();
        setPostList(posts);
        setFiltered(posts);

        const usersRes = await fetch('http://localhost:3001/users');
        const usersReturned = await usersRes.json();
        console.log('Fetched users:', usersReturned);
        setUsers(usersReturned);
      } catch (error) {
        console.error('Error fetching posts or users:', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    let filteredPosts = PostList;
    if (userFilter) {
      filteredPosts = filteredPosts.filter(post => post.userId === Number(userFilter));
    }
    if (search.trim()) {
      filteredPosts = filteredPosts.filter(
        post =>
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.body.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(filteredPosts);
  }, [search, userFilter, PostList]);

  return (
    <div className={styles.postsLayout}>
      <aside className={styles.postsSidebar} style={{ pointerEvents: isPostDetail ? 'none' : 'auto', opacity: isPostDetail ? 0.5 : 1 }}>
        <h3>Filter Posts</h3>
        <div>
          <label>User:</label>
          <select value={userFilter} onChange={e => setUserFilter(e.target.value)} disabled={isPostDetail}>
            <option value="">All</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.username}</option>
            ))}
          </select>
        </div>
        <div style={{marginTop: '1rem'}}>
          <label>Search:</label>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search title or body"
            className={styles.searchInput}
            disabled={isPostDetail}
          />
        </div>
        <button
          className={styles.addPostButton}
          style={{ marginTop: '1.5rem', width: '100%' }}
          onClick={() => navigate('new')}
          disabled={isPostDetail}
        >
          + Add Post
        </button>
      </aside>
      <main className={styles.redditList}>
        <Routes>
          <Route
            path="/"
            element={
              filtered.map((item) => (
                <PostItem
                  key={item.id}
                  post={item}
                  username={users.find(u => Number(u.id) === item.userId)?.username || `user ${users.find(u => u.id === item.id)?.username}`}
                />
              ))
            }
          />
          <Route path=":postId" element={<PostDetail />} />
        </Routes>
      </main>
    </div>
  );
}
