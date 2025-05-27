import { useEffect, useState } from "react";
import styles from '../style/items.module.css';
import { useParams } from "react-router-dom";

export default function AlbumList() {
  const [albumList, setAlbumList] = useState([]);
  const [newPhoto, setNewPhoto] = useState({ title: '', url: '' });
  const [editingPhotoId, setEditingPhotoId] = useState(null);
  const [editingPhoto, setEditingPhoto] = useState({ title: '', url: '' });
  const [menuPhotoId, setMenuPhotoId] = useState(null);

  const { userId, albumId } = useParams();

  useEffect(() => {
    fetchAlbum();
  }, [albumId]);

  async function fetchAlbum() {
    const url = `http://localhost:3001/photos?albumId=${albumId}`;
    const response = await fetch(url);
    const resAlbum = await response.json();
    setAlbumList(resAlbum);
  }

  const handleAddPhoto = async () => {
    if (!newPhoto.title.trim() || !newPhoto.url.trim()) return;
    const photo = { ...newPhoto, albumId: Number(albumId) };
    const response = await fetch('http://localhost:3001/photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(photo),
    });
    const createdPhoto = await response.json();
    setAlbumList((prev) => [...prev, createdPhoto]);
    setNewPhoto({ title: '', url: '' });
  };

  const handleDeletePhoto = async (id) => {
    await fetch(`http://localhost:3001/photos/${id}`, { method: 'DELETE' });
    setAlbumList((prev) => prev.filter(photo => photo.id !== id));
  };

  const handleEditPhoto = (photo) => {
    setEditingPhotoId(photo.id);
    setEditingPhoto({ title: photo.title, url: photo.url });
  };

  const handleSaveEditPhoto = async (id) => {
    const updatedPhoto = { ...editingPhoto, albumId: Number(albumId) };
    await fetch(`http://localhost:3001/photos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPhoto),
    });
    setAlbumList((prev) =>
      prev.map(photo => photo.id === id ? { ...photo, ...updatedPhoto } : photo)
    );
    setEditingPhotoId(null);
    setEditingPhoto({ title: '', url: '' });
  };

  return (
    <div>
      <div className={styles.addAlbum}>
        <input
          type="text"
          placeholder="Photo Title"
          value={newPhoto.title}
          onChange={e => setNewPhoto({ ...newPhoto, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Photo URL"
          value={newPhoto.url}
          onChange={e => setNewPhoto({ ...newPhoto, url: e.target.value })}
        />
        <button onClick={handleAddPhoto}>Add Photo</button>
      </div>
      <div className={styles.album}>
        {albumList.map((item) => (
          <div
            key={item.id}
            style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            onClick={() => setMenuPhotoId(menuPhotoId === item.id ? null : item.id)}
          >
            <img src={item.url} alt={item.title} style={{ maxWidth: '50vw', maxHeight: '50vh' }} loading="lazy" />
            <span>{item.title}</span>
            {menuPhotoId === item.id && (
              <div
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  background: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: 6,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  zIndex: 10,
                  padding: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
                onClick={e => e.stopPropagation()}
              >
                <button className={styles.menuButton} onClick={() => { setEditingPhotoId(item.id); setEditingPhoto({ title: item.title, url: item.url }); setMenuPhotoId(null); }}>Edit</button>
                <button className={styles.menuButton} onClick={() => { handleDeletePhoto(item.id); setMenuPhotoId(null); }}>Delete</button>
              </div>
            )}
            {editingPhotoId === item.id && (
              <div className={styles.addAlbum} style={{marginTop: '10px'}}>
                <input
                  type="text"
                  value={editingPhoto.title}
                  onChange={e => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                />
                <input
                  type="text"
                  value={editingPhoto.url}
                  onChange={e => setEditingPhoto({ ...editingPhoto, url: e.target.value })}
                />
                <button onClick={() => handleSaveEditPhoto(item.id)}>Save</button>
                <button onClick={() => setEditingPhotoId(null)}>Cancel</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
