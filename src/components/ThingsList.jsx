import { useEffect, useState } from "react"



export function ThingsList({url, Item }) {
  const [list, setList] = useState([])

  useEffect(() => {
    async function fetchList() {
      const response = await fetch(url);
      const resTodos = await response.json();
      //const todos = resTodos.map(obj => JSON.stringify(obj));
      //console.log(todos);
      setList(resTodos);
    }
    fetchList();
  }, [])

  return (
    <div>
    {list.map((item, index) => <Item key={index} data={item} />)}
    </ div>
  )
}
