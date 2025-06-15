import React from 'react';
import { Select, Group, Text, Badge, ComboboxItem, Tooltip } from '@mantine/core';
import { 
  IconTrophy, 
  IconSparkles, 
  IconMicrophone, 
  IconMessages, 
  IconPresentation, 
  IconMusic, 
  IconShirt, 
  IconDeviceGamepad2,
  IconMicrophone2
} from '@tabler/icons-react';
import { Competition } from '../services/competitionService';

const THEME_OPTIONS = [
  {
    value: 'default',
    label: 'Default Leetrboo Theme',
    description: 'Classic leetrboo competition theme',
    icon: <IconTrophy size="1rem" />,
    color: 'blue'
  },
  {
    value: 'halloween',
    label: 'Halloween Costume Contest',
    description: 'Spooky themed competition for Halloween',
    icon: <IconSparkles size="1rem" />,
    color: 'orange'
  },
  {
    value: 'karaoke',
    label: 'Karaoke',
    description: 'Sing your heart out competition',
    icon: <IconMicrophone size="1rem" />,
    color: 'pink'
  },
  {
    value: 'debate',
    label: 'Debate',
    description: 'Intellectual discussion and argumentation',
    icon: <IconMessages size="1rem" />,
    color: 'red'
  },
  {
    value: 'lightning_talks',
    label: 'Lightning Talks',
    description: 'Quick presentations and demos',
    icon: <IconPresentation size="1rem" />,
    color: 'yellow'
  },
  {
    value: 'dance_off',
    label: 'Dance Off',
    description: 'Show off your best moves',
    icon: <IconMusic size="1rem" />,
    color: 'purple'
  },
  {
    value: 'rap_battle',
    label: 'Rap Battle',
    description: 'Lyrical competition and freestyle',
    icon: <IconMicrophone2 size="1rem" />,
    color: 'dark'
  },
  {
    value: 'fashion_show',
    label: 'Fashion Show',
    description: 'Style and fashion competition',
    icon: <IconShirt size="1rem" />,
    color: 'grape'
  },
  {
    value: 'sing_off',
    label: 'Sing Off',
    description: 'Vocal performance competition',
    icon: <IconMicrophone size="1rem" />,
    color: 'teal'
  },
  {
    value: 'video_game_battle',
    label: 'Video Game Battle',
    description: 'Gaming tournament and competition',
    icon: <IconDeviceGamepad2 size="1rem" />,
    color: 'violet'
  }
];

type ThemeComboboxItem = ComboboxItem & {
  description?: string;
};

interface ThemeSelectorProps {
  value: Competition['theme'];
  onChange: (theme: Competition['theme']) => void;
  disabled?: boolean;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ value, onChange, disabled = false }) => {
  const selectedTheme = THEME_OPTIONS.find(theme => theme.value === value);

  const handleChange = (newValue: string | null) => {
    if (newValue) {
      onChange(newValue as Competition['theme']);
    }
  };

  return (
    <div>
      <Group gap="xs" mb="xs">
        <Text size="sm" fw={500}>Competition Theme</Text>
        {selectedTheme && (
          <Tooltip label={selectedTheme.description} withArrow position="top">
            <Badge 
              color={selectedTheme.color} 
              variant="light" 
              size="sm"
              leftSection={selectedTheme.icon}
              style={{ cursor: 'help' }}
            >
              {selectedTheme.label}
            </Badge>
          </Tooltip>
        )}
      </Group>
      
      <Select
        placeholder="Select a competition theme"
        data={THEME_OPTIONS.map(theme => ({
          value: theme.value,
          label: theme.label,
          description: theme.description
        }))}
        value={value || 'default'}
        onChange={handleChange}
        disabled={disabled}
        searchable
        clearable={false} // Prevent clearing to always have a theme selected
        renderOption={({ option }: { option: ThemeComboboxItem }) => {
          const theme = THEME_OPTIONS.find(t => t.value === option.value);
          return (
            <Tooltip label={theme?.description} withArrow position="right" disabled={!theme?.description}>
              <Group gap="sm" style={{ width: '100%', cursor: 'pointer' }}>
                <div style={{ color: `var(--mantine-color-${theme?.color}-6)` }}>
                  {theme?.icon}
                </div>
                <div>
                  <Text size="sm" c="dimmed">{option.label}</Text>
                </div>
              </Group>
            </Tooltip>
          );
        }}
      />
    </div>
  );
};

export default ThemeSelector;
export { THEME_OPTIONS };