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
      <div className={styles.album}>
        {albumList.map((item, index) => 
          <img src={item.url} alt={item.title} max-width="50vw" max-height="auto" loading="lazy"/>)}
    </div>
  )
}
