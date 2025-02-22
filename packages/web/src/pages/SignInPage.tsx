import { SignInForm } from "../components/AuthForms";
import { Image, Text, Center, Button } from "@mantine/core";
import Brand from "../assets/leetrboo_brand_bg.png";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

const SignInPage: React.FC = () => {
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
        <Col className="col">
          <SignInForm />
        </Col>
      </Row>
      <Row className="row mt-3 d-flex">
        <Col className="col vstack">
          <Button
            className="sign-up-btn"
            color="primary"
            component={Link}
            to="/signup"
          >
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
