import React, {FC} from "react";
// import Stats from "./Stats";
import Stopwatch from './Stopwatch';
import { Col, Row } from "reactstrap";
import bannerImage from "../assets/Halloween-costume-contest.png";

type Props = {

}

const Header: React.FC<Props> = ({}) => {
    return (
      <Row className="header hstack">
        <Col className="col-6">
          <img src={bannerImage} className="banner" alt="banner" />
        </Col>
        <Col className="col-2">
        </Col>
        <Col className="col-4">
          <Stopwatch />
        </Col>
      </Row>
    );
}

export default Header;