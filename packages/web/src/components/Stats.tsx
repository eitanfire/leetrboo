import React, { FC } from "react";

type Props = {};

const Stats: React.FC<Props> = ({}) => {
  return (
    <div className="stats">
      Players: Number of Players
      <br></br>
      <br></br>
      Points: Total Number of points
    </div>
  );
};

export default Stats;