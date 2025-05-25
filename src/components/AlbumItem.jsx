import { useState } from "react";
import styles from '../style/items.module.css';
import { useNavigate } from "react-router-dom";

export default function AlbumItem({ data }) {
  const navigate = useNavigate();
  //const [album, setAlbum] = useState(data);
  const album = data;

  const handleClick = () => {
    navigate(`/home/albums/${album.id}`)
  }

  return (
    <div onClick={handleClick} className={styles.container}>
      <p>{album.id}</p>
      <p>{album.title}</p>
    </div>
  )
}
