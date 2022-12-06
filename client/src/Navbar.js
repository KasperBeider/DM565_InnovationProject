import { Link, useMatch, useResolvedPath } from "react-router-dom" // used to avoid page refreshment every time
import React from 'react'

import "./styles/navbar.css"
import {BsSearch} from "react-icons/bs"

/**
 * Renders a navigation bar that displays different buttons
 * depending on the log-in state of the user.
 * @returns React Component
 */
export default function Navbar() {
    const [search, setSearch] = React.useState("");
    function searchFunc() {
        console.log(search)
    }

    return (
        <nav className="nav">
            <Link to="/" className="site-title">
                Inutilia Emptio
            </Link>
            <ul>
                <input type="text" 
                className="searchBar" 
                placeholder="Hvilket produkt vil du søge efter?"
                onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="searchButton" onClick={() => searchFunc()}>
                    <BsSearch/>
                </button>
                <CustomLink to="/butik">Butik</CustomLink>
                <CustomLink to="/kurv">Min Kurv</CustomLink>
                <CustomLink to="/kundeservice">Kundeservice</CustomLink>
            </ul>
        </nav>  
    )
}

// the ...props just ensure that we account for the additional props presented like class name etc.
function CustomLink( {to, children,...props} ){
    const resolvedPath = useResolvedPath(to)

    // end: true ensures that "to" path must match completely, i.e. store/pan1 =! store/pan2 but store/pan1 === store/pan1
    const isActive = useMatch( {path: resolvedPath.pathname, end: true})

    // i.e. only set classname of list component to "active" if we're in the path of that href
    return (
        <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    )
}