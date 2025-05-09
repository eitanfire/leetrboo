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
} from "@mantine/core";
import { IconCopy, IconCheck } from "@tabler/icons-react";
import Header from "./components/Header";
import ParticipantForm from "./components/AddPlayerForm";
import ListPlayerEntries from "./components/ListPlayerEntries";
import { Competition, useCompetitions } from "./services/competitionService";
import { useAuth } from "./contexts/AuthContext";

const LeetrbooApp: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [selectedCompetition, setSelectedCompetition] =
    useState<Competition | null>(null);
  const {
    competitions,
    isLoading: competitionsLoading,
    error,
  } = useCompetitions();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/signin", { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (competitions.length > 0 && !selectedCompetition) {
      setSelectedCompetition(competitions[0]);
      console.log("Selected initial competition:", competitions[0]);
    }
  }, [competitions, selectedCompetition]);

  if (authLoading || competitionsLoading) {
    return (
      <Container fluid className="p-0">
        <Header />
        <Container className="mt-4">
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
        <Header />
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
    <Container fluid className="p-0">
      <Header />
      <Container className="mt-4">
        {competitions.length === 0 ? (
          <Row>
            <Col>
              <Alert color="info" mt="xl">
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
                console.log("Competition selected:", competition);
              }}
              competitions={competitions}
            />
          </Col>
        </Row>

        {selectedCompetition && selectedCompetition.competition_code && (
          <Row className="mt-3 mb-3">
            <Col>
              <Stack gap="xs">
                <Title order={5}>Invite Participants</Title>
                <Text size="sm">
                  Share this code with participants so they can join:
                </Text>
                <Group gap="xs" wrap="nowrap">
                  <TextInput
                    readOnly
                    value={selectedCompetition.competition_code}
                    style={{ fontFamily: "monospace", flexGrow: 1 }}
                    aria-label="Competition Invite Code"
                  />
                  <CopyButton
                    value={selectedCompetition.competition_code}
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
                </Group>
                <Text size="xs" c="dimmed">
                  Participants can enter this code via "Enter a Competition".
                </Text>
              </Stack>
            </Col>
          </Row>
        )}

        {selectedCompetition && (
          <Row className="mt-4">
            <Col>
              <ListPlayerEntries
                key={selectedCompetition.id}
                selectedCompetition={selectedCompetition}
              />
            </Col>
          </Row>
        )}
      </Container>
    </Container>
  );
};

export default LeetrbooApp;
