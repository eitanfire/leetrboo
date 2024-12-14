import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { listPlayerEntries, type PlayerEntryRow } from "../services/playerEntry";
import { Row, Col } from "reactstrap";

const ListPlayerEntries = () => {
    const [list, setList] = useState<PlayerEntryRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEntries = async () => {
        try {
            setIsLoading(true);
            const result = await listPlayerEntries();
            console.log("Fetched Entries:", result);
            setList(result);
            setError(null);
        } catch (error) {
            console.error("Error fetching player entries:", error);
            setError('Failed to fetch player entries');
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch and real-time subscription setup
    useEffect(() => {
        fetchEntries();

        const channel = supabase
            .channel('player_entries')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'player_entries' },
                (payload) => {
                    console.log("Full Real-Time Payload:", payload);
                    console.log("Event Type:", payload.eventType);
                    console.log("New Data:", payload.new);
                    console.log("Old Data:", payload.old);

                    if (payload.eventType === 'INSERT') {
                        const newRow = payload.new as PlayerEntryRow;
                        setList(prevList => {
                            // Check if entry already exists to prevent duplicates
                            const exists = prevList.some(item => item.id === newRow.id);
                            return exists ? prevList : [...prevList, newRow];
                        });
                    }
                    else if (payload.eventType === 'UPDATE') {
                        const updatedRow = payload.new as PlayerEntryRow;
                        setList(prevList => 
                            prevList.map(item => 
                                item.id === updatedRow.id ? updatedRow : item
                            )
                        );
                    }
                    else if (payload.eventType === 'DELETE') {
                        const deletedRow = payload.old as PlayerEntryRow;
                        setList(prevList => 
                            prevList.filter(item => item.id !== deletedRow.id)
                        );
                    }
                }
            )
            .subscribe((status, err) => {
                console.log("Subscription Status:", status);
                if (err) {
                    console.error("Subscription Error:", err);
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (isLoading) {
        return <div>Loading player entries...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="list-player-entries">
            {list.length === 0 ? (
                <div>No player entries found.</div>
            ) : (
                list.map((item) => (
                    <Row key={item.id}>
                        <Col className="player-name">{item.player_name}{' '}</Col>
                        <Col>
                            <a 
                                href={item.video_url} 
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <button>
                                    🎤{' '}{item.video_url}
                                </button>
                            </a>
                        </Col>
                    </Row>
                ))
            )}
        </div>
    );
};

export default ListPlayerEntries;