
import {useState} from "react"

import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";

import "./styles/app.css"

import Home from "./pages/Home";
import SearchResult from "./pages/SearchResult";
import Support from "./pages/Support";
import React from "react";

function App() {

    return (
    <>
        <Navbar/>
        <div className="container">
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/search/:query" element={<SearchResult/>} />
                <Route path="/support" element={<Support/>}/>
            </Routes>
        </div>
    </>
    );
}

export default App;
