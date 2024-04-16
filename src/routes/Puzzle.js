import { useState } from "react";
import "../style.scss";
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Square({ userValue, onSquareClick }) {

    if (userValue == "incorrectSquare") {
        return <button className={userValue} onClick={onSquareClick} >x</button>;
    } else {
        return <button className={userValue} onClick={onSquareClick} ></button>;
    }
}

function TopClueBox({ clue }) {
    return <div className="topClueBox">{clue}</div>
}

function SideClueBox({ clue }) {
    return <div className="sideClueBox">{clue}</div>
}

function SpacerBox() {
    return <div className="spacerBox"></div>
}

function CornerSpacerBox() {
    return <div className="cornerSpacerBox"></div>
}

function SolvedState({ solvedState }) {
    return <h2 className="solvedStateHeader">{solvedState}</h2>
}

function Header() {
    return (
        <header className="header">
            <Link className="headerLink" to={"../"}>
                <div className="headerLinkDiv">
                    <p className="headerLink">Home</p>
                </div>
            </Link>
        </header>
    )
}

function NewPuzzleButton({ onNewPuzzleButtonClick }) {
    return <button className="newPuzzleButton" onClick={onNewPuzzleButtonClick}>New Puzzle</button>
}

function Board({ ans, gridSize, rowClues, colClues, updateCorectness, userInputted, setUserInputted }) {

    function handleClick(squareRow, squareCol) {
        var userInputtedUpdated = userInputted.slice(); //note to self -creating a copycat array bc immutability so not all child components automatically re-render, bc not all need to. (https://react.dev/learn/tutorial-tic-tac-toe search immutability)
        if (ans[squareRow][squareCol] === 1) { //is this square correct or not
            userInputtedUpdated[squareRow][squareCol] = "filledSquare"
            updateCorectness(true);
        } else {
            userInputtedUpdated[squareRow][squareCol] = "incorrectSquare"
            updateCorectness(false);
        }
        setUserInputted(userInputtedUpdated);
    };

    return (
        <>
            <div className="board-squares">
                {generateGridElements(gridSize, colClues, rowClues, userInputted, handleClick)}
            </div>
        </>
    )
}

function BoardAndSolvedState({ ans, gridSize, rowClues, colClues, userInputted, setUserInputted, solvedState, setSolvedState, numCorrect, setNumCorrect }) {

    function updateCorectness(correctOrNot) {
        if (correctOrNot === true) {
            setNumCorrect(numCorrect + 1)
            console.log("numcorrect =", (numCorrect + 1)) // +1 because of the delay between the effect of set state and the javascript. With the +1 this will follow the actual value of num correct.
        }
        let ansFlat = ans.join()
        if ((numCorrect + 1) === (ansFlat.match(/1/g) || []).length) {
            console.log("solved!")
            setSolvedState("Solved!")
        }
    }

    return (
        <>
            <SolvedState solvedState={solvedState} />
            <Board ans={ans} gridSize={gridSize} rowClues={rowClues} colClues={colClues} updateCorectness={updateCorectness} userInputted={userInputted} setUserInputted={setUserInputted} />
        </>
    )
}

function Game({ gridSizePassed }) {
    //I don't think I entirely understand when/not to use useState.
    var gridSize = gridSizePassed;
    //Define/set ans and clues
    const [ans, setAns] = useState(generateAns(gridSize));
    var clues = calculateClues(ans, gridSize);
    const [rowClues, setRowClues] = useState(clues[0]);
    const [colClues, setColClues] = useState(clues[1]);

    //calcuate css
    generateSquareStyles(gridSize);

    //set userInputted (has to be up here so it can be reset)
    function generateUserInputtedAllBlank() {
        var temp = []
        for (var i = 0; i < gridSize; i++) {
            temp.push(Array(gridSize).fill("emptySquare"));
        };
        return temp;
    }
    const [userInputted, setUserInputted] = useState(generateUserInputtedAllBlank());

    //Set variables for the solved header
    const [solvedState, setSolvedState] = useState("");
    const [numCorrect, setNumCorrect] = useState(0);


    function resetGame() {
        console.log("reset callled")

        //reset ans
        var updatedAns = generateAns(gridSize); //React will ignore your update if the next state is equal to the previous state - must create new variable rather than muting ans.
        setAns(updatedAns);
        console.log("ans", updatedAns);

        //reset clues
        clues = calculateClues(updatedAns, gridSize);
        setRowClues(clues[0]);
        setColClues(clues[1]);
        console.log(rowClues);

        //reset squares clicked
        setUserInputted(generateUserInputtedAllBlank());

        //reset squares registered as correct
        setNumCorrect(0)

        //remove header
        setSolvedState("")
    }

    return (
        <>
            <BoardAndSolvedState ans={ans} gridSize={gridSize} rowClues={rowClues} colClues={colClues} userInputted={userInputted} setUserInputted={setUserInputted} solvedState={solvedState} setSolvedState={setSolvedState} numCorrect={numCorrect} setNumCorrect={setNumCorrect} />
            <div className="newPuzzleButtonPositionDiv">
                <NewPuzzleButton onNewPuzzleButtonClick={() => resetGame()} />
            </div>
        </>
    )
}

export default function Page() {
    var gridSize = 5; //default value

    const location = useLocation();
    var gridSizePassed = location.state; //set passed value from home page

    var gridSizePreProcess = null;
    var gridSizePreProcess = gridSizePassed;

    //if passed as object from custom
    if (typeof (gridSizePreProcess) === 'object') {
        gridSizePreProcess = gridSizePreProcess["passSize"]
    };

    //process this thing into a single number
    if (gridSizePreProcess) {
        gridSizePreProcess = gridSizePreProcess.split("x");
        gridSizePreProcess = gridSizePreProcess[0];
        gridSize = parseInt(gridSizePreProcess);
    }

    return (
        <>
            <Header />
            <Game gridSizePassed={gridSize} />
        </>
    )
}
//process functions
function generateAns(gridSize) {
    //Create ans
    var ans = [];

    //Generate empty grid for ans
    for (var i = 0; i < gridSize; i++) {
        ans.push(Array(gridSize).fill(0));
    };

    //randomly fill ans grid
    for (var a = 0; a < ans.length; a++) {
        for (var b = 0; b < ans.length; b++) {
            if (Math.floor(Math.random() * 4) === 3) {
                ans[a][b] = 1;
            };
        };
    };
    // console.log(ans)
    return ans
};

function calculateClues(ans, gridSize) {
    var rowClues = []
    for (var i = 0; i < gridSize; i++) { //define rowClues fully
        rowClues.push([]);
    };
    var colClues = []
    for (var i = 0; i < gridSize; i++) { //define rowClues fully
        colClues.push([]);
    };

    function checkStreak(streak, direction) {
        if (streak > 0) {
            if (direction === "row") {
                rowClues[a].push(streak);
            } else if (direction === "col") {
                colClues[a].push(streak);
            };
        };
        return 0;
    };

    for (var a = 0; a < ans.length; a++) {
        var rowStreak = 0;
        var colStreak = 0;
        for (var b = 0; b < ans.length; b++) {
            if (ans[a][b] === 1) { //comb grid row
                rowStreak += 1;
            } else {
                rowStreak = checkStreak(rowStreak, "row");
            };
            if (ans[b][a] === 1) { //comb grid column
                colStreak += 1;
            } else {
                colStreak = checkStreak(colStreak, "col");
            };
        };
        rowStreak = checkStreak(rowStreak, "row");
        colStreak = checkStreak(colStreak, "col");
    };
    return [rowClues, colClues]
};

function generateGridElements(gridSize, colClues, rowClues, userInputted, handleClick) {
    let boardElements = [];
    let boardElementsNested = [];

    boardElements.push(<CornerSpacerBox key="top-left-spacer" />) //one empty as spacer at the start
    //generate top clue row
    for (let i = 0; i < gridSize; i++) {
        boardElements.push(<TopClueBox clue={colClues[i].join(", ")} key={i} />)//key i becasue that the column clues item being accessed.
    };
    boardElements.push(<SpacerBox key="top-clues-spacer" />)

    for (let i = 0; i < gridSize; i++) { //generates each squares row
        boardElements.push(<SideClueBox clue={rowClues[i].join(", ")} key={"rowClues[" + i + "]"} />)
        for (let j = 0; j < gridSize; j++) {
            boardElements.push(<Square userValue={userInputted[i][j]} onSquareClick={() => handleClick(i, j)} key={"[" + i + "]" + "[" + j + "]"} />)
        }
        boardElements.push(<SpacerBox key={"row " + i + " spacer"} />)
    }

    // for (let i = 0; i < gridSize; i++) {
    //     boardElements.push(<SpacerBox key={i} />)//key i so no error
    // };

    //encases in row divs
    for (let i = 0; i <= (gridSize); i++) {
        boardElementsNested.push(<div className="row" key={i}>{boardElements.slice((gridSize * i) + (i * 2), (gridSize * (i + 1)) + (i * 2) + 2)}</div>)
    }
    //slice(0+0, 5+0+1) 0,6
    return boardElementsNested
    // return boardElements
}

function generateSquareStyles(gridSize) {
    const root = document.documentElement;
    var sqSize = 400 / gridSize;
    if (sqSize < 45) {
        sqSize = 45
        root?.style.setProperty("--side-clue-box-width", (sqSize * 2) + "px");
    } else {
        root?.style.setProperty("--side-clue-box-width", sqSize + "px");
    }

    root?.style.setProperty("--grid-size", gridSize);
    root?.style.setProperty("--square-size", sqSize + "px");
}