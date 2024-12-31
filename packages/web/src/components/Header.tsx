import React, { FC } from "react";
import Stopwatch from "./Stopwatch";
import { Col, Row } from "reactstrap";
import bannerImage from "../assets/Halloween-costume-contest.png";
import LogoutButton from "./LogoutButton"; // Add this import

type Props = {};

const Header: React.FC<Props> = ({}) => {
  return (
    <Row className="header hstack">
      <Col className="col-6">
        <img src={bannerImage} className="banner" alt="banner" />
      </Col>
        <LogoutButton />
      <Col className="col-4">
        <Stopwatch />
      </Col>
    </Row>
  );
};

export default Header;
