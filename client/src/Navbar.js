import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom" // used to avoid page refreshment every time

import "./styles/navbar.css"
import {BsSearch} from "react-icons/bs"
import {useState} from 'react'

/**
 * Renders a navigation bar that displays different buttons (shoppinglist, support, search bar)
 * @returns React Component
 */
export default function Navbar() {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    function searchFunction( query ){
        setSearch("");
        navigate("/search/" + query);
    }

    return (
        <nav className="nav">
            <Link to="/" className="site-title">
                Billig & Bedst
            </Link>
            <ul>
                <input type="text" 
                className="searchBar" 
                placeholder="Hvilket produkt vil du søge efter?..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="searchButton" onClick={() => searchFunction(search)}>
                    <BsSearch/>
                </button>
                <CustomLink to="/shoppingList">Min indkøbsliste</CustomLink>
                <CustomLink to="/support">Kundeservice</CustomLink>
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