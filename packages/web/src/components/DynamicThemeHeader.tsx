import React from 'react';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconPalette } from '@tabler/icons-react';
import { Competition } from '../services/competitionService';
import Brand from '../assets/leetrboo_brand_bg.png';

interface HeaderProps {
  selectedCompetition: Competition | null;
  onThemeModalOpen?: () => void;
}

const Header: React.FC<HeaderProps> = ({ selectedCompetition, onThemeModalOpen }) => {
  const getThemeClass = (theme?: Competition['theme']) => {
    return theme ? `theme-${theme.replaceAll('_', '-')}` : 'theme-default';
  };

  const themeClass = getThemeClass(selectedCompetition?.theme);

  const headerStyles: React.CSSProperties = {
    background: selectedCompetition?.theme === 'default' 
      ? `var(--primary-color, #2196f3)` 
      : `linear-gradient(135deg, var(--primary-color, #2196f3) 0%, var(--secondary-color, #1565c0) 100%)`,
    color: 'white',
    padding: '1rem 2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: 'none',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <header className={`header header-transition ${themeClass}`} style={headerStyles}>
      {/* Brand image as background element */}
      {selectedCompetition?.theme === 'default' && (
        <img 
          src={Brand} 
          alt="Brand background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: '45% 30%',
            zIndex: 0,
            opacity: 0.3,
          }}
        />
      )}
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '1.8rem',
          fontWeight: 'bold',
          color: 'white'
        }}>
          Leetrboo
        </h1>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {selectedCompetition && (
            <div style={{
              textAlign: 'right',
              color: 'white'
            }}>
              <div style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                marginBottom: '0.25rem'
              }}>
                {selectedCompetition.name}
              </div>
              {selectedCompetition.theme && selectedCompetition.theme !== 'default' && (
                <div style={{
                  fontSize: '0.85rem',
                  opacity: 0.8,
                  textTransform: 'capitalize'
                }}>
                  {selectedCompetition.theme.replace('_', ' ')} Theme
                </div>
              )}
            </div>
          )}

          {selectedCompetition && onThemeModalOpen && (
            <Tooltip label="Customize Theme" withArrow position="bottom">
              <ActionIcon
                variant="subtle"
                size="lg"
                onClick={onThemeModalOpen}
                style={{
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  minWidth: '40px',
                  minHeight: '40px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <IconPalette size="1.2rem" style={{ color: 'white' }} />
              </ActionIcon>
            </Tooltip>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
