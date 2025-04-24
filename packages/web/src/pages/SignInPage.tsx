// src/pages/SignInPage.tsx
import { SignInForm } from "../components/AuthForms";
import { Image, Text, Button } from "@mantine/core";
import Brand from "../assets/leetrboo_brand_bg.png";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import { JoinCompetitionModal } from "../components/JoinCompetitionModal";
import React, { useState, useCallback } from "react";

const SignInPage: React.FC = () => {
  // Use state to track modal visibility
  const [joinModalOpened, setJoinModalOpened] = useState(false);

  // Use callback to ensure consistent reference
  const handleOpenModal = useCallback(() => {
    console.log("Opening modal - setting state to true");
    setJoinModalOpened(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    console.log("Closing modal - setting state to false");
    setJoinModalOpened(false);
  }, []);

  console.log("SignInPage rendering. Modal open state:", joinModalOpened);

  return (
    <Container fluid className="auth-container">
      <h1>
        <Text fz="sm" fw={1000}>
          leetrboo
        </Text>
      </h1>
      <Row className="row">
        <Col className="col">
          <Image radius="md" height={300} src={Brand} alt="boo!" />
        </Col>
        <Col className="col mb-4">
          <Text>
            <h2>Sign In</h2>
          </Text>
          <SignInForm />
        </Col>
      </Row>

      {/* Button to open the modal */}
      <Button className="mt-3" color="teal" onClick={handleOpenModal}>
        Join a Competition
      </Button>

      {/* Modal component with opened prop */}
      <JoinCompetitionModal
        opened={joinModalOpened}
        onClose={handleCloseModal}
      />

      <Row className="row mt-3 d-flex">
        <Col className="col vstack">
          {/* Link to Sign Up page */}
          <Button className="sign-up-btn" component={Link} to="/signup">
            Sign up
          </Button>
          <Button
            className="mt-3"
            variant="subtle"
            component={Link}
            to="/reset-password"
          >
            Forgot Password
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default SignInPage;
