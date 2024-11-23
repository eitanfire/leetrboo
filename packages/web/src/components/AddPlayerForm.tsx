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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    console.log('New participant added:', formData);
    
    // Reset the form after submission
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
    </form>
  );
};

export default ParticipantForm;