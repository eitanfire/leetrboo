import { useEffect, useState } from "react";
import { listPlayerEntries, type PlayerEntryRow } from "../services/playerEntry";
import { Row, Col } from "reactstrap";

const ListPlayerEntries = () => {
    const [list, setlist] = useState<PlayerEntryRow[]>([])
    useEffect(() => {
        const result = listPlayerEntries()
        result.then(setlist)
    }, [])
    return (
        <div className="list-player-entries">
            {list.map(item => {
                return <Row><Col className="player-name">{item.player_name}{'  '}</Col>
                    <Col><a href={item.video_url} target="_blank"
                        rel="noopener noreferrer">                    <button>
                            🎤{' '}{item.video_url}
                        </button>
                    </a>
                    </Col>
                    </Row>
            })}
        </div>
    )
}

export default ListPlayerEntries;