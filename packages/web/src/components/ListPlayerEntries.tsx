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
                return <div>{item.player_name}{'  '}
                    <a href={item.video_url} target="_blank"
                        rel="noopener noreferrer">                    <button>
                            🎤{item.video_url}
                        </button>
                    </a>
                </div>
            })}
        </div>
    )
}

export default ListPlayerEntries;