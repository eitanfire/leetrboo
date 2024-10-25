import Header from "./components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import React, { FC } from "react";

type Props = {};

const App: React.FC<Props> = ({}) => {
  return (
    <>
      <Header />
      <div className="content-body"></div>
    </>
  );
};

export default App;