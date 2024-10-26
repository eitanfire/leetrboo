import React, {FC} from "react";
import Stats from "./Stats";
import Stopwatch from './Stopwatch';
import { Col, Row } from "reactstrap";
import bannerImage from "../assets/Halloween-costume-contest.png";

type Props = {

}

const Header: React.FC<Props> = ({}) => {
    return (
      <Row className="header">
        <Col className="col-7">
          <img src={bannerImage} className="banner" alt="banner" />
        </Col>
        <Col className="col-2">
          <Stats />
        </Col>
        <Col className="col-3">
          <Stopwatch />
        </Col>
      </Row>
    );
}

export default Header;