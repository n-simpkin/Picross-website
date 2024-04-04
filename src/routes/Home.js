import { useState } from "react";
import "../style.scss";
import { Link } from 'react-router-dom';

function CreateGameButton({ buttonValue }) {
  return <Link className="sizeButton" state={buttonValue} to={`/puzzle/`}>{buttonValue}</Link>
}

function CreateGameCustomButton() {
  return <Link className="sizeButton" to={`/custom-puzzle-size/`}>Custom</Link>
}

export default function CreateGame() {
  const sizeOptions = ["5x5", "10x10"]

  return (
    <>
      <h1 className="prePuzzleHeader">Choose Puzzle Size</h1>
      <div className="sizeButtonHolder">
        <CreateGameButton buttonValue={sizeOptions[0]} />
        <CreateGameButton buttonValue={sizeOptions[1]} />
        <CreateGameCustomButton />
      </div>
    </>
  )
}
