import { Link, Navigate, NavLink } from 'react-router-dom';
import styles from './style/HomeLayout.module.css';

export function HomeLayout() {

  return (
    <nav className={styles.nav}>
      <NavLink to='/home'>Home</NavLink>
      <NavLink to='/home/info'>Info</NavLink>
      <NavLink to='/home/todos'>Todos</NavLink>
      <NavLink to='/home/posts'>Posts</NavLink>
      <NavLink to='/home/albums'>Albums</NavLink>
    </nav>
  )
}
