import { useReducer } from "react";
import "../style.scss";
import { Navigate, useNavigate } from 'react-router-dom';

const formReducer = (state, event) => {
    return {
        ...state,
        [event.target.name]: event.target.value
    }
}

export default function CreateCustomGameUI() {
    const [formData, setFormData] = useReducer(formReducer, {});
    const navigate = useNavigate();

    const handleSubmit = event => {
        event.preventDefault();
        console.log(formData)
        console.log(formData["gridSize"])
        console.log(String(formData["gridSize"]) + "x" + String(formData["gridSize"]))
        navigatePuzzle(String(formData["gridSize"]) + "x" + String(formData["gridSize"]))
    }

    function navigatePuzzle(passSize) {
        navigate("/puzzle", { state: { passSize } })
    }

    return (
        <>
            <div className="wrapper">
                <h1 className="prePuzzleHeader">Enter grid size</h1>
                <div className="centreForm">
                    <form className="customSizeForm" onSubmit={handleSubmit}>
                        <fieldset className="createCustomFieldset">
                            <label>
                                <input className="createCustomInput" name="gridSize" onChange={setFormData} max="24" min="1" type="number" />
                            </label>
                        </fieldset>
                        <button className="submitCustomPuzzleSizeButton" type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </>
    )
}