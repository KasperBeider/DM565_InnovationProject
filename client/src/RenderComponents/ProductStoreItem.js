import "../styles/product.css"

import {React, useState, useEffect } from 'react'
import axios from 'axios'

export default function ProductStoreItem(probs) {

    const row = probs.dataRow
    const [storeRow, setStoreRow] = useState([])
    const [avgPrice, setAvgPrice] = useState(0)

    useEffect( () => {
        async function getStoreInfo(){
            const res = await axios.get("/store", {params: {storeId: row.store_id}})
            setStoreRow(res.data)
        }
        async function getAvgPrice(){
            const res = await axios.get("/avg-price", {params: {ean: row.product_ean,
                                                        store_id: row.store_id}})
            console.log(res)
            setAvgPrice(res.data[0].avg.toFixed(2))
        }

        getStoreInfo()
        getAvgPrice()
    }, [row])

    function render(){
        return (
            <>
                <div className="product--store--info">
                    <p>Mængde: {row.contents} {row.contents_unit}</p>
                    <p>Pris: {row.price},- DKK</p>
                    <p>Pris pr. {row.unit}: {row.unit_price},- DKK</p>
                    <p>Gennemsnitspris: {avgPrice},- DKK </p>
                    {row.campaign_unit_price && <p> Tilbudspris: {row.campaign_unit_price} DKK </p> }
                    <p>{storeRow.length > 0 ? storeRow[0].store_name : ""}</p>
                </div>
                
            </>
        )
    }

    return render()
}
