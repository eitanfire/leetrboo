import React, { useState } from 'react';
import { Col } from 'reactstrap';
import { usePlayerEntries } from '../services/playerEntry';
import { PlayerEntry } from '../services/playerEntry';

const ParticipantForm: React.FC = () => {
  const { insertPlayerEntry, totalCount } = usePlayerEntries();
  
  const [formData, setFormData] = useState<PlayerEntry>({
    player_name: '',
    video_url: ''
  });

  const [errors, setErrors] = useState<{
    player_name?: string;
    video_url?: string;
  }>({});

  const [submitError, setSubmitError] = useState<string | null>(null);

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
    const newErrors: typeof errors = {};
    
    if (!formData.player_name.trim()) {
      newErrors.player_name = 'Name is required';
    }

    if (!formData.video_url.trim()) {
      newErrors.video_url = 'Video URL is required';
    } else if (!isValidYouTubeUrl(formData.video_url)) {
      newErrors.video_url = 'Please enter a valid YouTube URL';
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
    
    if (errors[name as keyof typeof errors]) {
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
          player_name: formData.player_name,
          video_url: formData.video_url
        });
        
        // Check if the entry was successfully inserted
        if (newEntry) {
          // Reset form
          setFormData({
            player_name: '',
            video_url: ''
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
          <label htmlFor="player_name">Name:&nbsp;</label>
          <input
            id="player_name"
            name="player_name"
            value={formData.player_name}
            onChange={handleChange}
            placeholder="Enter participant's name"
            className={errors.player_name ? 'error' : ''}
          />
          {errors.player_name && <div className="error-message">{errors.player_name}</div>}
        </div>
        <div>
          <label htmlFor="video_url">YouTube video URL:&nbsp;</label>
          <input
            id="video_url"
            name="video_url"
            value={formData.video_url}
            onChange={handleChange}
            placeholder="Enter YouTube URL"
            className={errors.video_url ? 'error' : ''}
          />
          {errors.video_url && <div className="error-message">{errors.video_url}</div>}
        </div>
        <button type="submit" className='primary'>Add Participant</button>
        {submitError && <div className="error-message">{submitError}</div>}
        <div>
          Total players: {totalCount !== null ? totalCount : 'Loading...'}
        </div>
      </form>
    </Col>
  );
};

export default ParticipantForm;