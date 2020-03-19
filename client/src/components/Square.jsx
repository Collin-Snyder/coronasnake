import React, { memo, useState, useEffect, useMemo } from "react";

const Square = memo(({ id }) => {
  return <div className="square" id={id}></div>;
});

export default Square;
