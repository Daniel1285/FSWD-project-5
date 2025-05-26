import { useEffect, useState } from "react"
import styles from '../style/items.module.css';
import AlbumItem from "../components/AlbumItem";

export default function Albums({user}){
  const [albumList, setAlbumList] = useState([]);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');

  useEffect(() => {
    async function fetchList() {
      const url = `http://localhost:3001/albums?userId=${user.id}`;
      const response = await fetch(url);
      const resTodos = await response.json();
      setAlbumList(resTodos);
    }
    fetchList();
  }, [])

  const handleAddAlbum = async () => {
    if (!newAlbumTitle.trim()) return;
    const newAlbum = { userId: user.id, title: newAlbumTitle };
    const response = await fetch('http://localhost:3001/albums', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAlbum),
    });
    const createdAlbum = await response.json();
    setAlbumList((prev) => [...prev, createdAlbum]);
    setNewAlbumTitle('');
  };

  return (
    <>
      <div className={styles.addAlbum}>
        <input
          type="text"
          placeholder="New Album Title"
          value={newAlbumTitle}
          onChange={e => setNewAlbumTitle(e.target.value)}
        />
        <button onClick={handleAddAlbum}>Add Album</button>
      </div>
      <div className={styles.comp}>
        {albumList.map((item, index) => <AlbumItem key={index} data={item} />)}
      </div>
    </>
  )
}
