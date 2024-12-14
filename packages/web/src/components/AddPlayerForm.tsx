import { Col } from 'reactstrap';
import { useState, useEffect } from 'react';
import { insertPlayerEntry, countPlayerEntries } from '../services/playerEntry';

type ParticipantFormData = {
  name: string;
  videoUrl: string;
}

type FormErrors = {
  name?: string;
  videoUrl?: string;
}

const ParticipantForm = () => {
  const [formData, setFormData] = useState<ParticipantFormData>({
    name: '',
    videoUrl: ''
  });

  const [totalPlayers, setTotalPlayers] = useState<number | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotalPlayers = async () => {
      const count = await countPlayerEntries();
      setTotalPlayers(count);
    };

    fetchTotalPlayers();
  }, []);

  const isValidYouTubeUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      
      // Check for standard youtube.com URLs
      if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
        const videoId = urlObj.searchParams.get('v');
        return !!videoId;
      }
      
      // Check for shortened youtu.be URLs
      if (urlObj.hostname === 'youtu.be') {
        const videoId = urlObj.pathname.slice(1); // Remove the leading slash
        return !!videoId;
      }

      return false;
    } catch {
      return false;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.videoUrl.trim()) {
      newErrors.videoUrl = 'Video URL is required';
    } else if (!isValidYouTubeUrl(formData.videoUrl)) {
      newErrors.videoUrl = 'Please enter a valid YouTube URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }

    // Clear submit error when user starts typing
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset any previous submit errors
    setSubmitError(null);
    
    if (validateForm()) {
      try {
        const newEntry = await insertPlayerEntry({
          player_name: formData.name, 
          video_url: formData.videoUrl
        });
        
        // Check if the entry was successfully inserted
        if (newEntry) {
          // Refresh total players count
          const updatedCount = await countPlayerEntries();
          setTotalPlayers(updatedCount);
          
          // Reset form
          setFormData({
            name: '',
            videoUrl: ''
          });
          setErrors({});
        } else {
          setSubmitError('Failed to add participant. Please try again.');
        }
      } catch (error) {
        console.error('Error submitting player entry:', error);
        setSubmitError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <Col>
      <form onSubmit={handleSubmit} className='add-player-form hstack'>
        <span className='add-player-form-title'>Participant Information</span>
        <div>
          <label htmlFor="name">Name:&nbsp;</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter participant's name"
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        <div>
          <label htmlFor="videoUrl">YouTube video URL:&nbsp;</label>
          <input
            id="videoUrl"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            placeholder="Enter YouTube URL"
            className={errors.videoUrl ? 'error' : ''}
          />
          {errors.videoUrl && <div className="error-message">{errors.videoUrl}</div>}
        </div>
        <button type="submit" className='primary'>Add Participant</button>
        {submitError && <div className="error-message">{submitError}</div>}
        <div>
          Total players: {totalPlayers !== null ? totalPlayers : 'Loading...'}
        </div>
      </form>
    </Col>
  );
};

export default ParticipantForm;