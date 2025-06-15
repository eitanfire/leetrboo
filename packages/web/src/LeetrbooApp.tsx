import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Spinner, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {
  TextInput,
  Group,
  CopyButton,
  Tooltip,
  ActionIcon,
  Text,
  Stack,
  Title,
  Modal,
  Paper,
  Center,
  Card,
  Divider,
} from "@mantine/core";
import { IconCopy, IconCheck, IconMaximize, IconPalette } from "@tabler/icons-react";
import Header from "./components/DynamicThemeHeader";
import ParticipantForm from "./components/AddPlayerForm";
import ListPlayerEntries from "./components/ListPlayerEntries";
import ThemeSelector from "./components/ThemeSelector";
import { Competition, useCompetitions } from "./services/competitionService";
import { useAuth } from "./contexts/AuthContext";

const LeetrbooApp: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const {
    competitions,
    isLoading: competitionsLoading,
    error,
    updateCompetitionTheme,
  } = useCompetitions();

  const [competitionName, setCompetitionName] = useState('');
  const [userHasTypedName, setUserHasTypedName] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/signin", { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (competitions.length > 0 && !selectedCompetition) {
      setSelectedCompetition(competitions[0]);
      setCompetitionName(competitions[0].theme || '');
    }
  }, [competitions, selectedCompetition]);

  const getThemeClass = (theme?: Competition['theme']) => {
return theme ? `theme-${theme.replaceAll('_', '-')}` : 'theme-default';
  };

 const handleThemeChange = async (theme: Competition['theme']) => {
  console.log('handleThemeChange called with theme:', theme);
  console.log('selectedCompetition before update:', selectedCompetition);
  
  if (!selectedCompetition) {
    console.log('No selected competition, returning early');
    return;
  }

  try {
    console.log('Calling updateCompetitionTheme...');
    await updateCompetitionTheme(selectedCompetition.id, theme);
    console.log('updateCompetitionTheme completed successfully');
    
    setSelectedCompetition(prev => {
      const newCompetition = prev ? { ...prev, theme } : null;
      console.log('Updated selectedCompetition:', newCompetition);
      return newCompetition;
    });
  } catch (error) {
    console.error("Failed to update theme:", error);
  }
};
 
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserHasTypedName(true);
    setCompetitionName(e.target.value);
  };

  if (authLoading || competitionsLoading) {
    return (
      <Container fluid className="p-0">
<Header 
  selectedCompetition={selectedCompetition} 
  onThemeModalOpen={() => setIsThemeModalOpen(true)}
/>        <Container className="mt-4">
          <Row>
            <Col
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: "200px" }}
            >
              <div className="text-center">
                <Spinner color="primary" />
                <div className="mt-2">
                  {authLoading
                    ? "Verifying authentication..."
                    : "Loading competitions..."}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="p-0">
        <Header 
  selectedCompetition={selectedCompetition} 
  onThemeModalOpen={() => setIsThemeModalOpen(true)}
/>
        <Container className="mt-4">
          <Row>
            <Col>
              <Alert color="danger">
                Error loading competitions: {error.message}
                <Button
                  color="link"
                  className="d-block mt-2"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </Alert>
            </Col>
          </Row>
        </Container>
      </Container>
    );
  }

  return (
<div className={getThemeClass(selectedCompetition?.theme)}>
      <Container fluid className="p-0">
        <Header 
  selectedCompetition={selectedCompetition} 
  onThemeModalOpen={() => setIsThemeModalOpen(true)}
/>
        <Container className="mt-4">
          {competitions.length === 0 ? (
            <Row>
              <Col>
                <Alert color="info" className="mt-4">
                  No competitions available. Please create a new competition to
                  get started.
                </Alert>
              </Col>
            </Row>
          ) : null}

          <Row>
            <Col>
              <ParticipantForm
                selectedCompetition={selectedCompetition}
                onCompetitionSelect={(competition) => {
                  setSelectedCompetition(competition);
                  setCompetitionName(competition.theme || '');
                }}
                competitions={competitions}
              />
            </Col>
          </Row>

          {selectedCompetition && selectedCompetition.competition_code && (
            <Center style={{ minHeight: '35vh' }}>
              <Paper shadow="md" p="xl" radius="md" withBorder>
                <Stack align="center" gap="xs">
                  <Title order={5} ta="center">
                    Join the Competition
                  </Title>

                  <Text size="sm" ta="center">
                    Share this code with participants so they can join:
                  </Text>

                  <Group gap="xs" wrap="nowrap" justify="center">
                    <TextInput
                      size="md"
                      readOnly
                      value={selectedCompetition.competition_code
                        .slice(-6)
                        .toUpperCase()}
                      style={{ width: "90px" }}
                      aria-label="Competition Invite Code"
                    />
                    <CopyButton
                      value={selectedCompetition.competition_code
                        .slice(-6)
                        .toUpperCase()}
                      timeout={2000}
                    >
                      {({ copied, copy }) => (
                        <Tooltip
                          label={copied ? "Copied!" : "Copy code"}
                          withArrow
                          position="right"
                        >
                          <ActionIcon
                            color={copied ? "teal" : "gray"}
                            variant="subtle"
                            onClick={copy}
                          >
                            {copied ? (
                              <IconCheck size="1rem" />
                            ) : (
                              <IconCopy size="1rem" />
                            )}
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </CopyButton>
                    <Tooltip
                      label="Show in larger view"
                      withArrow
                      position="right"
                    >
                      <ActionIcon
                        color="blue"
                        variant="subtle"
                        onClick={() => setIsInviteModalOpen(true)}
                      >
                        <IconMaximize size="1rem" />
                      </ActionIcon>
                    </Tooltip>
                  </Group>

                  <Text size="md" c="dimmed" ta="center">
                    Participants can enter this code via "Enter a Competition"
                  </Text>
                </Stack>
              </Paper>
            </Center>
          )}

          {selectedCompetition && (
            <Row>
              <Col>
                <ListPlayerEntries
                  key={selectedCompetition.id}
                  selectedCompetition={selectedCompetition}
                />
              </Col>
            </Row>
          )}
        </Container>

        {/* Theme Customization Modal */}
        <Modal
          opened={isThemeModalOpen}
          onClose={() => setIsThemeModalOpen(false)}
          title="Customize Competition Theme"
          centered
          size="lg"
        >
          <Stack gap="md">
            <Text>
              Choose a theme that matches your competition style. This will affect
              the visual appearance and branding throughout the competition.
            </Text>

            <ThemeSelector
              value={selectedCompetition?.theme || 'default'}
              onChange={(theme) => {
                handleThemeChange(theme);
                setIsThemeModalOpen(false);
              }}
            />

            <Divider />

            <Text size="sm" c="dimmed">
              Theme changes will be applied immediately and affect all participants' views.
            </Text>
          </Stack>
        </Modal>

        {/* Invite Code Modal */}
        <Modal
          opened={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          title="Competition Invite Code"
          centered
          size="lg"
        >
          <Stack gap="md">
            <Text>
              Share this code with participants so they can join your competition:
            </Text>

            <Paper p="xl" bg="gray.1" radius="md">
              <Center>
                <Text
                  fw={700}
                  ff="monospace"
                  c="dark"
                  style={{
                    letterSpacing: "0.5em",
                    fontSize: "4rem",
                    userSelect: "all",
                  }}
                >
                  {selectedCompetition?.competition_code.slice(-6).toUpperCase()}
                </Text>
              </Center>
            </Paper>

            <Group justify="center" gap="md">
              <CopyButton
                value={
                  selectedCompetition?.competition_code.slice(-6).toUpperCase() ||
                  ""
                }
                timeout={2000}
              >
                {({ copied, copy }) => (
                  <Button
                    onClick={copy}
                    color={copied ? "teal" : "blue"}
                    leftSection={
                      copied ? (
                        <IconCheck size="1rem" />
                      ) : (
                        <IconCopy size="1rem" />
                      )
                    }
                  >
                    {copied ? "Copied!" : "Copy Code"}
                  </Button>
                )}
              </CopyButton>
            </Group>

            <Text size="sm" c="dimmed" ta="center">
              Participants can enter this code via "Enter a Competition" to join
              the competition.
            </Text>
          </Stack>
        </Modal>
      </Container>
    </div>
  );
};

export default LeetrbooApp;
