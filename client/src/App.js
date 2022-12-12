import {useState} from "react"
import { Routes, Route } from "react-router-dom";

import "./styles/app.css"
import Navbar from "./Navbar";
import Home from "./pages/Home";
import SearchResult from "./pages/SearchResult";
import Support from "./pages/Support";
import Product from "./pages/Product"
import ShoppingList from "./pages/ShoppingList";
import Model from "./pages/Model";
import {ShoppingListContext} from "./ShoppingListContext"

/**
 * The overall structure of the web-page.
 * Denotes the routing of all individual pages.
 */

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
                    <Route path="/model/:ean/store/:storeId" element={<Model/>} />
                </Routes>
            </div>
        </ShoppingListContext.Provider>
    </>
    );
}

export default App;
