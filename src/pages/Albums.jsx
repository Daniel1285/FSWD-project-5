import { useEffect, useState } from "react"
import styles from '../style/items.module.css';
import AlbumItem from "../components/AlbumItem";

export default function Albums({user}){
  const [albumList, setAlbumList] = useState([]);

  useEffect(() => {
    async function fetchList() {
      const url = `http://localhost:3001/albums?userId=${user.id}`;
      const response = await fetch(url);
      const resTodos = await response.json();
      //const todos = resTodos.map(obj => JSON.stringify(obj));
      //console.log(todos);
      setAlbumList(resTodos);
    }
    fetchList();
  }, [])

  return (
    <div className={styles.comp}>
    {albumList.map((item, index) => <AlbumItem key={index} data={item} />)}
    </ div>
  )
}
