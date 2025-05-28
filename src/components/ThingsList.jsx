import { useEffect, useState } from "react"
import styles from '../style/items.module.css';
import { useParams } from "react-router-dom";



export function ThingsList({url, Item }) {
  const [list, setList] = useState([])

  useEffect(() => {
    async function fetchList() {
      try {
        const response = await fetch(url);
        const resTodos = await response.json();
        setList(resTodos);
      } catch (error) {
        console.error('Error fetching list:', error);
      }
    }
    fetchList();
  }, [])

  return (
    <div className={styles.comp}>
    {list.map((item, index) => <Item key={index} data={item} />)}
    </ div>
  )
}
