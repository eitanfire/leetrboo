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
    color: 'blue',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    preview: ['#667eea', '#764ba2', '#f8f9fa']
  },
  {
    value: 'halloween',
    label: 'Halloween Costume Contest',
    description: 'Spooky themed competition for Halloween',
    icon: <IconSparkles size="1rem" />,
    color: 'orange',
    gradient: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
    preview: ['#ff6b35', '#f7931e', '#2d1b18']
  },
  {
    value: 'karaoke',
    label: 'Karaoke',
    description: 'Sing your heart out competition',
    icon: <IconMicrophone size="1rem" />,
    color: 'pink',
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    preview: ['#ff9a9e', '#fecfef', '#4a0e4e']
  },
  {
    value: 'debate',
    label: 'Debate',
    description: 'Intellectual discussion and argumentation',
    icon: <IconMessages size="1rem" />,
    color: 'red',
    gradient: 'linear-gradient(135deg, #f44336 0%, #c62828 100%)',
    preview: ['#f44336', '#c62828', '#ffebee']
  },
  {
    value: 'lightning_talks',
    label: 'Lightning Talks',
    description: 'Quick presentations and demos',
    icon: <IconPresentation size="1rem" />,
    color: 'yellow',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    preview: ['#ffecd2', '#fcb69f', '#3e2723']
  },
  {
    value: 'dance_off',
    label: 'Dance Off',
    description: 'Show off your best moves',
    icon: <IconMusic size="1rem" />,
    color: 'purple',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    preview: ['#a8edea', '#fed6e3', '#4a148c']
  },
  {
    value: 'rap_battle',
    label: 'Rap Battle',
    description: 'Lyrical competition and freestyle',
    icon: <IconMicrophone2 size="1rem" />,
    color: 'dark',
    gradient: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
    preview: ['#434343', '#000000', '#757575']
  },
  {
    value: 'fashion_show',
    label: 'Fashion Show',
    description: 'Style and fashion competition',
    icon: <IconShirt size="1rem" />,
    color: 'grape',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    preview: ['#fa709a', '#fee140', '#4a148c']
  },
  {
    value: 'sing_off',
    label: 'Sing Off',
    description: 'Vocal performance competition',
    icon: <IconMicrophone size="1rem" />,
    color: 'teal',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    preview: ['#4facfe', '#00f2fe', '#00695c']
  },
  {
    value: 'video_game_battle',
    label: 'Video Game Battle',
    description: 'Gaming tournament and competition',
    icon: <IconDeviceGamepad2 size="1rem" />,
    color: 'violet',
    gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
    preview: ['#d299c2', '#fef9d7', '#3f51b5']
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
        clearable={false}
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