import "../styles/product.css"

import React from 'react'

import {useParams} from 'react-router-dom'
import {useEffect, useState, useContext} from 'react'
import ProductStoreItem from '../RenderComponents/ProductStoreItem'
import axios from 'axios'
import { ShoppingListContext } from "../ShoppingListContext"

export default function Product() {

    let {ean} = useParams()
    
    const [gotResult, setGotResult] = useState(false)
    const [dataRows, setDataRows] = useState([])
    const [productFound, setProductFound] = useState(false)
    
    const {shoppingList, setShoppingList} = useContext(ShoppingListContext)


    useEffect( () => {
        localStorage.setItem("SHOPPINGLIST", JSON.stringify(shoppingList))
    }, [shoppingList] )

    useEffect( () => {
        async function getProductStoreInfo(){
            const res = await axios.get("/product-store-info", {params: {ean: ean}})
            const arr = res.data
            if (arr.length > 0){
                // when products are returned remove the loading screen
                setProductFound(true)
                setDataRows(arr)
            }

            setGotResult(true)
        }

        getProductStoreInfo()
    }, [ean])

    function addToList(product) {
        if(!shoppingList.includes(product)) {
            setShoppingList(oldShoppingList => ([
                ...oldShoppingList, product
            ]))
        }
    }

    function productFoundView(){
        return (
            <>
                <div className="product--container">
                    <div className="product--header">
                        <p className="product--name">{dataRows[0].product_name}</p>
                        <button className="product--add--button" onClick={() => addToList(dataRows[0].product_ean)}> Tilføj til indkøbsliste </button>
                    </div>
                    <p className="product--description">
                            Gennemsnitspriserne er beregnet ud fra data fra de sidste 4 ugers priser for det givne produkt i den givne butik.</p>
                            <p className="product--description"><span style={{ fontWeight: 'bold' }}>Tryk</span> på det enkelte produkt for at få en oversigt over prisudviklingen.</p>
                    <div className="product--list">
                        {dataRows.map(row => {
                            return <ProductStoreItem dataRow={row}/>
                        })}
                    </div>
                </div>
                
            </>
        )
    }

    function productNotFoundView(){
        return (
            <>
                <p className="not--found">404: Produktet findes ikke.</p>
                <p>Vi kunne ikke finde noget produkt med kode: {ean}. Kom du fra søgesiden?</p>
            </>
        )
    }

    function render(){
        if (!gotResult)
            return ( <p className="product--loading"> Indlæser. Vent venligst. </p> )
        if (productFound){
            return productFoundView()
        }
        else{
            return productNotFoundView()
        }

    }


    return ( render() )
}
