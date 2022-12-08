
import {useState, useEffect} from "react"

import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";

import "./styles/app.css"

import Home from "./pages/Home";
import SearchResult from "./pages/SearchResult";
import Support from "./pages/Support";
import Product from "./pages/Product"
import ShoppingList from "./pages/ShoppingList";
import {ShoppingListContext} from "./ShoppingListContext"

function App() {

    const [shoppingList, setShoppingList] = useState([])


    return (
    <>
        <ShoppingListContext.Provider value={{shoppingList, setShoppingList}}>
            <Navbar/>
            <div className="container">
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/shoppingList" element={<ShoppingList/>}/>
                    <Route path="/search/:query" element={<SearchResult/>} />
                    <Route path="/support" element={<Support/>}/>
                    <Route path="/product/:ean" element={<Product/>} />
                </Routes>
            </div>
        </ShoppingListContext.Provider>
    </>
    );
}

export default App;
