import { useEffect, useState } from "react";
import { listPlayerEntries, type PlayerEntryRow } from "../services/playerEntry";


const ListPlayerEntries = () => {
    const [list, setlist] = useState<PlayerEntryRow[]>([])
    useEffect(() => {
        const result = listPlayerEntries()
        result.then(setlist)
    }, [])
    return (
        <div className="list-player-entries">
            {list.map(item => {
                return <div>{item.player_name}{'  '}{item.video_url}</div>
            })}
        </div>
    )
}

export default ListPlayerEntries;