import {useState, useEffect} from "react"
import axios from 'axios'

export default function ShoppingListItem(product) {

    const thisProduct = product.product
    
    return (
        <div>
            <h1> Test </h1>
            <p> Produkt navn: {thisProduct.product_name} </p>
            <p> Beskrivelse: {thisProduct.product_desc} </p>
            {thisProduct.campaign_unit_price && <p> Tilbudspris: {thisProduct.campaign_unit_price} DKK  </p> }
            {!thisProduct.campaign_unit_price && <p> Pris {thisProduct.price} </p>}
            <p> {thisProduct.contents}{thisProduct.contents_unit} </p>
        </div>
    )
}


// <p> {JSON.stringify(thisProduct)} </p>