// src/pages/SignInPage.tsx
import { SignInForm } from "../components/AuthForms";
import { Image, Text, Button } from "@mantine/core";
import Brand from "../assets/leetrboo_brand_bg.png";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import { JoinCompetitionModal } from "../components/JoinCompetitionModal";
import React, { useState, useCallback } from "react";

const SignInPage: React.FC = () => {
  const [joinModalOpened, setJoinModalOpened] = useState(false);

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
        <Text c="black" fz="5rem" fw={1000}>
          leetrboo
        </Text>
      </h1>
      <Row className="row">
        <Col className="col">
          <Image
            radius="md"
            style={{
              width: "80%",
              height: "auto",
              display: "block",
            }}
            src={Brand}
            alt="boo!"
          />
        </Col>
        <Col className="col mb-4">
          <Text c="black" fz="5rem" fw={1000}>
            <h2>Sign In</h2>
          </Text>
          <SignInForm />
        </Col>
      </Row>

      <Button
        className="mt-3"
        color="teal"
        style={{ minHeight: "36px" }}
        onClick={handleOpenModal}
      >
        Join a Competition
      </Button>

      <JoinCompetitionModal
        opened={joinModalOpened}
        onClose={handleCloseModal}
        zIndex={1000}
      />

      <Row className="row mt-3 d-flex">
        <Col className="col vstack">
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