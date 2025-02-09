import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Spinner, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

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

  // Handle auth state changes
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/signin", { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Automatically select the first competition when data loads
  useEffect(() => {
    if (competitions.length > 0 && !selectedCompetition) {
      setSelectedCompetition(competitions[0]);
      console.log("Selected initial competition:", competitions[0]);
    }
  }, [competitions, selectedCompetition]);

  // Handle loading states
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

  // Handle errors
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

  // Handle no competitions case
  if (competitions.length === 0) {
    return (
      <Container fluid className="p-0">
        <Header />
        <Container className="mt-4">
          <Row>
            <Col>
              <Alert color="info">
                No competitions available. Please create a new competition to
                get started.
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
        <Row>
          <Col>
            <ParticipantForm
              selectedCompetition={selectedCompetition}
              onCompetitionSelect={(competition) => {
                setSelectedCompetition(competition);
                console.log("Competition selected:", competition);
              }}
            />
          </Col>
        </Row>
        {selectedCompetition && (
          <Row className="mt-4">
            <Col>
              <ListPlayerEntries
                key={selectedCompetition.id} // Force re-render when competition changes
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
