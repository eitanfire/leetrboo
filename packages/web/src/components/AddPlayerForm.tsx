import { useState } from 'react';

type ParticipantFormData = {
  name: string;
  videoUrl: string;
}

const ParticipantForm = () => {
  const [formData, setFormData] = useState<ParticipantFormData>({
    name: '',
    videoUrl: ''
  });

  // Add a new state for storing all players
  const [players, setPlayers] = useState<ParticipantFormData[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Create a separate function that will later become the callback
  const addPlayer = (player: ParticipantFormData) => {
    setPlayers(prevPlayers => [...prevPlayers, player]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Call addPlayer with the current form data
    addPlayer(formData);
    
    // Log both the new player and the updated array
    console.log('New player added:', formData);
    console.log('All players:', [...players, formData]);
    
    // Reset the form
    setFormData({
      name: '',
      videoUrl: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className='add-player-form hstack'>
      <span>Participant Information</span>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter participant's name"
        />
      </div>
      <div>
        <label htmlFor="videoUrl">Link for music video:</label>
        <input
          id="videoUrl"
          name="videoUrl"
          value={formData.videoUrl}
          onChange={handleChange}
          placeholder="Enter video URL"
        />
      </div>
      <button type="submit">Add Participant</button>
      <div>Total players: {players.length}</div>
    </form>
  );
};

export default ParticipantForm;