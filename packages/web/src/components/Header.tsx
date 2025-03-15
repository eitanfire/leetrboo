import React, { FC } from "react";
import Stopwatch from "./Stopwatch";
import { Col, Row } from "reactstrap";
import bannerImage from "../assets/Halloween-costume-contest.png";
import LogoutButton from "./LogoutButton";

type Props = {};

const Header: React.FC<Props> = ({}) => {
  return (
    <Row className="header hstack">
      <Col xs={6}>
        <img src={bannerImage} className="banner" alt="banner" />
      </Col>
      <Col xs={2}>
        <LogoutButton />
      </Col>
      <Col xs={4}>
        <Stopwatch />
      </Col>
    </Row>
  );
};

export default Header;
