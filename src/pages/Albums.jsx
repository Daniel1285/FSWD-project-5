import { useRef, useEffect, useState } from "react"
import styles from '../style/albums.module.css';
import AlbumItem from "../components/AlbumItem";
import { useParams } from "react-router-dom";

export default function Albums(){
  const { userId } = useParams();
  const [albumList, setAlbumList] = useState([]);
  const newAlbumTitle = useRef();

  useEffect(() => {
    async function fetchList() {
      try {
        const url = `http://localhost:3001/albums?userId=${userId}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch albums');
        const resTodos = await response.json();
        setAlbumList(resTodos);
      } catch (error) {
        console.error('Error fetching albums:', error);
      }
    }
    fetchList();
  }, [userId])

  const handleAddAlbum = async () => {
    if (!newAlbumTitle.current.value.trim()) return;
    try {
      const newAlbum = { userId: userId, title: newAlbumTitle.current.value };
      console.log('Adding new album:', newAlbum);
      const response = await fetch('http://localhost:3001/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAlbum),
      });
      if (!response.ok) throw new Error('Failed to add album');
      const createdAlbum = await response.json();
      setAlbumList((prev) => [...prev, createdAlbum]);
      newAlbumTitle.current.value = '';
    } catch (error) {
      console.error('Error adding album:', error);
    }
  };

  return (
    <>
      <div className={styles.addAlbum}>
        <input
          type="text"
          placeholder="New Album Title"
          ref={newAlbumTitle}
        />
        <button onClick={handleAddAlbum}>Add Album</button>
      </div>
      <div className={styles.comp}>
        {albumList.map((item, index) => <AlbumItem key={index} data={item} />)}
      </div>
    </>
  )
}
