import React, { useState } from 'react';
import { 
  Modal, 
  Stack, 
  Text, 
  Group, 
  Card, 
  Badge, 
  Button, 
  Box, 
  Divider,
  Grid,
  ThemeIcon,
  Tooltip,
  Transition,
  Paper
} from '@mantine/core';
import {
  IconTrophy, 
  IconSparkles, 
  IconMicrophone, 
  IconMessages, 
  IconPresentation, 
  IconMusic, 
  IconShirt, 
  IconDeviceGamepad2,
  IconMicrophone2,
  IconCheck,
  IconPalette,
  IconUsers,
  IconMap
} from '@tabler/icons-react';

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

const ThemeCard = ({ theme, isSelected, onClick }) => {
  return (
    <Card
      shadow={isSelected ? "lg" : "sm"}
      padding="md"
      radius="md"
      withBorder
      style={{
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        borderColor: isSelected ? `var(--mantine-color-${theme.color}-6)` : undefined,
        position: 'relative'
      }}
      onClick={() => onClick(theme.value)}
    >
      <Transition mounted={isSelected} transition="scale" duration={200}>
        {(styles) => (
          <Box
            style={{
              ...styles,
              position: 'absolute',
              top: -8,
              right: -8,
              zIndex: 10
            }}
          >
            <ThemeIcon
              color={theme.color}
              size="sm"
              radius="xl"
              variant="filled"
            >
              <IconCheck size="0.8rem" />
            </ThemeIcon>
          </Box>
        )}
      </Transition>

      <Group justify="space-between" mb="xs">
        <Group gap="xs">
          <ThemeIcon
            color={theme.color}
            variant="light"
            radius="md"
            size="lg"
          >
            {theme.icon}
          </ThemeIcon>
          <div>
            <Text fw={500} size="sm" c="dark">{theme.label}</Text>
            <Text size="xs" c="gray.7">{theme.description}</Text>
          </div>
        </Group>
      </Group>

      <Group gap="xs" mt="sm">
        {theme.preview.map((color, index) => (
          <Box
            key={index}
            w={20}
            h={20}
            style={{
              backgroundColor: color,
              borderRadius: '50%',
              border: '2px solid white',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
          />
        ))}
      </Group>

      <Box
        mt="xs"
        h={4}
        style={{
          background: theme.gradient,
          borderRadius: 2,
          opacity: 0.8
        }}
      />
    </Card>
  );
};

// Function to determine if a color is light or dark
const getContrastColor = (gradient) => {
  // Extract the first color from the gradient (the dominant color)
  const colorMatch = gradient.match(/#[0-9a-fA-F]{6}/);
  if (!colorMatch) return '#000000'; // fallback to black
  
  const hex = colorMatch[0];
  
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

const EnhancedThemeModal = ({ opened, onClose, value, onChange }) => {
  // Use the value prop as the selected theme, fallback to 'default'
  const selectedTheme = value || 'default';

  const handleThemeChange = (theme) => {
    // Call the onChange callback immediately when a theme is selected
    if (onChange) {
      onChange(theme);
    }
  };

  const handleApplyTheme = () => {
    // Close the modal when apply is clicked
    onClose();
  };

  const selectedThemeData = THEME_OPTIONS.find(t => t.value === selectedTheme);
  
  // Get the appropriate text color for the selected theme
  const previewTextColor = selectedThemeData ? getContrastColor(selectedThemeData.gradient) : '#000000';

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <ThemeIcon color="blue" variant="light" size="lg">
            <IconPalette size="1.2rem" />
          </ThemeIcon>
          <div>
            <Text size="lg" fw={600}>Customize Competition Theme</Text>
            <Text size="xs" c="dimmed">Transform your competition's visual identity</Text>
          </div>
        </Group>
      }
      centered
      size="xl"
      radius="lg"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      styles={{
        header: {
          paddingBottom: 0
        },
        body: {
          paddingTop: 'var(--mantine-spacing-md)'
        }
      }}
    >
      <Stack gap="lg">
        {/* Description Section */}
        <Paper p="md" radius="md" withBorder style={{ backgroundColor: 'var(--mantine-color-blue-0)' }}>
          <Group gap="sm" mb="xs">
            <IconMap size="1rem" color="var(--mantine-color-blue-6)" />
            <Text size="sm" fw={500} c="blue">Choose Your Perfect Style</Text>
          </Group>
          <Text size="sm" c="dimmed">
            Select a theme that matches your competition's personality. Each theme includes 
            carefully crafted colors, gradients, and styling to create an immersive experience.
          </Text>
        </Paper>

        {/* Theme Grid */}
        <Grid>
          {THEME_OPTIONS.map((theme) => (
            <Grid.Col key={theme.value} span={{ base: 12, sm: 6, md: 4 }}>
              <ThemeCard
                theme={theme}
                isSelected={selectedTheme === theme.value}
                onClick={handleThemeChange}
              />
            </Grid.Col>
          ))}
        </Grid>

        {/* Selected Theme Preview */}
        {selectedThemeData && (
          <Paper p="md" radius="md" withBorder>
            <Group gap="sm" mb="sm">
              <ThemeIcon color={selectedThemeData.color} variant="light">
                {selectedThemeData.icon}
              </ThemeIcon>
              <div>
                <Text fw={500}>{selectedThemeData.label}</Text>
                <Text size="sm" c="dimmed">{selectedThemeData.description}</Text>
              </div>
              <Badge color={selectedThemeData.color} variant="light">
                Selected
              </Badge>
            </Group>
            
            <Box
              h={60}
              style={{
                background: selectedThemeData.gradient,
                borderRadius: 'var(--mantine-radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: previewTextColor,
                fontWeight: 600,
                textShadow: previewTextColor === '#ffffff' 
                  ? '0 1px 3px rgba(0, 0, 0, 0.7)' 
                  : '0 1px 3px rgba(255, 255, 255, 0.7)',
                fontSize: '1.1rem'
              }}
            >
              Theme Preview - {selectedThemeData.label}
            </Box>
          </Paper>
        )}

        <Divider />

        {/* Info Section */}
        <Paper p="sm" radius="md" style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
          <Group gap="sm">
            <IconUsers size="1rem" color="var(--mantine-color-gray-6)" />
            <Text size="sm" c="dimmed">
              Theme changes apply instantly and are visible to all participants
            </Text>
          </Group>
        </Paper>

        {/* Action Buttons */}
        <Group justify="flex-end" gap="sm">
          <Button
            variant="subtle"
            color="gray"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            variant="gradient"
            gradient={selectedThemeData ? 
              { from: selectedThemeData.color, to: selectedThemeData.color, deg: 45 } : 
              { from: 'blue', to: 'cyan', deg: 45 }
            }
            onClick={handleApplyTheme}
            leftSection={<IconCheck size="1rem" />}
          >
            Done
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default EnhancedThemeModal;