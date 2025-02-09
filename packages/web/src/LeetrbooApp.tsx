import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Header from "./components/Header";
import ParticipantForm from "./components/AddPlayerForm";
import ListPlayerEntries from "./components/ListPlayerEntries";
import { Competition, useCompetitions } from "./services/competitionService";

const LeetrbooApp: React.FC = () => {
  const [selectedCompetition, setSelectedCompetition] =
    useState<Competition | null>(null);
  const { competitions, isLoading, error } = useCompetitions();

  // Automatically select the first competition when data loads
  useEffect(() => {
    if (competitions.length > 0 && !selectedCompetition) {
      setSelectedCompetition(competitions[0]);
    }
  }, [competitions, selectedCompetition]);

  if (isLoading) {
    return (
      <Container fluid className="p-0">
        <Header />
        <Container className="mt-4">
          <Row>
            <Col>
              <div className="text-center">Loading competitions...</div>
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
              onCompetitionSelect={setSelectedCompetition}
            />
          </Col>
        </Row>
        {selectedCompetition && (
          <Row className="mt-4">
            <Col>
              <ListPlayerEntries selectedCompetition={selectedCompetition} />
            </Col>
          </Row>
        )}
      </Container>
    </Container>
  );
};

export default LeetrbooApp;
