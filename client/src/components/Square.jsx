import React from "react";

const Square = ({isSnake}) => {
    return <div className={isSnake ? 'square' : 'square snake'}></div>;
}

export default Square;