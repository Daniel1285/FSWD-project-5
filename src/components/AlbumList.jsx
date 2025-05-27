import { useEffect, useState, useRef } from "react";
import styles from '../style/albumList.module.css';
import { useParams } from "react-router-dom";

export default function AlbumList() {
  const [photos, setPhotos] = useState([]);
  const [newPhoto, setNewPhoto] = useState({ title: '', url: '' });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: '', url: '' });
  const [menuId, setMenuId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(21);
  const [visible, setVisible] = useState({});
  const observer = useRef(null);

  const { albumId } = useParams();
  useEffect(() => {
    fetch(`http://localhost:3001/photos?albumId=${albumId}`)
      .then(res => res.json())
      .then(data => setPhotos(data));
  }, [albumId]);

useEffect(() => {
  observer.current = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('data-id');
        if (id) {
          setVisible(prev => ({ ...prev, [id]: true }));
        }
      }
    });
  }, { threshold: 0.2 });
}, []);

  const addPhoto = async () => {
    if (!newPhoto.title || !newPhoto.url) return;
    const response = await fetch('http://localhost:3001/photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newPhoto, albumId: Number(albumId) })
    });
    const created = await response.json();
    setPhotos(prev => [...prev, created]);
    setNewPhoto({ title: '', url: '' });
  };

  const deletePhoto = async (id) => {
    await fetch(`http://localhost:3001/photos/${id}`, { method: 'DELETE' });
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const saveEdit = async (id) => {
    const response = await fetch(`http://localhost:3001/photos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editData, albumId: Number(albumId) })
    });
    const updated = await response.json();
    setPhotos(prev => prev.map(p => p.id === id ? updated : p));
    setEditingId(null);
  };

  return (
    <div>

      <div className={styles.addPhotoForm}>
        <input placeholder="Title" value={newPhoto.title}
          onChange={e => setNewPhoto({ ...newPhoto, title: e.target.value })} />
        <input placeholder="URL" value={newPhoto.url}
          onChange={e => setNewPhoto({ ...newPhoto, url: e.target.value })} />
        <button onClick={addPhoto}>Add Photo</button>
      </div>

      <div className={styles.albumGrid}>
        {photos.slice(0, visibleCount).map(photo => (
          <div
            key={photo.id}
            className={`${styles.photoCard} ${visible[photo.id] ? styles.photoVisible : styles.photoHidden}`}
            data-id={photo.id}
            ref={el => el && observer.current.observe(el)}
            onClick={() => setMenuId(menuId === photo.id ? null : photo.id)}
          >
            <img src={photo.url} alt={photo.title} loading="lazy" />
            <span className={styles.title}>{photo.title}</span>

            {menuId === photo.id && (
              <div className={styles.menu} onClick={e => e.stopPropagation()}>
                <button className={styles.menuButton} onClick={() => {
                  setEditData({ title: photo.title, url: photo.url });
                  setEditingId(photo.id);
                  setMenuId(null);
                }}>Edit</button>
                <button className={styles.menuButton} onClick={() => deletePhoto(photo.id)}>Delete</button>
              </div>
            )}

            {editingId === photo.id && (
              <div className={styles.editForm}>
                <input value={editData.title}
                  onChange={e => setEditData({ ...editData, title: e.target.value })} />
                <input value={editData.url}
                  onChange={e => setEditData({ ...editData, url: e.target.value })} />
                <button onClick={() => saveEdit(photo.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            )}
          </div>
        ))}
      </div>

      
      {visibleCount < photos.length && (
        <div className={styles.loadMoreWrapper}>
          <button className={styles.menuButton} onClick={() => setVisibleCount(prev => prev + 9)}>Load more... </button>
        </div>
      )}
    </div>
  );
}
