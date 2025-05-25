import { useEffect, useState } from "react";
import styles from '../style/items.module.css';
import { useParams } from "react-router-dom";

export default function AlbumList({ user }) {
  const [albumList, setAlbumList] = useState([]);

  const { albumId } = useParams();
  console.log(albumId);

  useEffect(() => {
    async function fetchAlbum() {
      const url = `http://localhost:3001/photos?albumId=${albumId}`;
      console.log(url);
      const response = await fetch(url);
      const resAlbum = await response.json();
      console.log(resAlbum);
      setAlbumList(resAlbum);
    }
    fetchAlbum();
  }, [])

  return (
    <div className={styles.container}>
      <ul>
        {albumList.map((item, index) => <li>
          <img src={item.url} alt={item.title} width="500" height="600"/>
        </li>)}
      </ul>
    </div>
  )
}
