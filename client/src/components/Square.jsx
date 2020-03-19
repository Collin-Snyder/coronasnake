import React, { memo } from "react";

const Square = memo(({ id }) => {
  return <div className="square" id={id}></div>;
});

export default Square;
