import Header from "./components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { FC } from "react";
import { Container } from "reactstrap";

type Props = {};

const App: React.FC<Props> = ({}) => {
  return (
    <Container fluid className="p-0">
      <Header />
      <div className="content-body"></div>
    </Container>
  );
};

export default App;
