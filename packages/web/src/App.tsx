import Header from "./components/Header";

import React, { FC } from "react";

type Props = {};

const App: React.FC<Props> = ({}) => {
  return (
    <>
      <Header />
      <div className="body"></div>
    </>
  );
};

export default App;