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
        <Col>
          <img src={bannerImage} className="banner" alt="banner" />
        </Col>
        <Col>
          <Stats />
        </Col>
        <Col>
          <Stopwatch />
        </Col>
      </Row>
    );
}

export default Header;