import styles from '../style/albumItem.module.css';
import { useNavigate } from 'react-router-dom';

export default function AlbumItem({ data }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`${data.id}`);
  };

  return (
    <div className={styles.albumCard} onClick={handleClick}>
      <h3 className={styles.albumId}>#{data.id}</h3>
      <p className={styles.albumTitle}>{data.title}</p>
    </div>
  );
}
