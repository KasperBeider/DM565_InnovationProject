import React from "react";
import "../styles/support.css"

export default function Support() {
    const [email, setEmail] = React.useState("");
    const [desc, setDesc] = React.useState("");

    function handleOnClick() {
        console.log(email);
        setEmail("");
        setDesc("");
    }

    return (
        <div className="support--main">
            <h1> Kundeservice </h1>
            <input 
                type="input" 
                className="support--input"
                placeholder="Din email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            /> 
            <textarea 
                    name="description" 
                    className="support--input-desc"
                    placeholder="Beskriv dit problem"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
            ></textarea>
            <button className="support--button" onClick={() => handleOnClick()}>
                Indsend
            </button>
        </div>
    )
}