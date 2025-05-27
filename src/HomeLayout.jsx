import { Link, Navigate, NavLink } from 'react-router-dom';
import styles from './style/HomeLayout.module.css';

export function HomeLayout({userId}) {

  return (
    <nav className={styles.nav}>
      <NavLink to={`/home/users/${userId}`}>Home</NavLink>
      <NavLink to={`/home/users/${userId}/info`}>Info</NavLink>
      <NavLink to={`/home/users/${userId}/todos`}>Todos</NavLink>
      <NavLink to={`/home/users/${userId}/posts`}>Posts</NavLink>
      <NavLink to={`/home/users/${userId}/albums`}>Albums</NavLink>
    </nav>
  )
}
