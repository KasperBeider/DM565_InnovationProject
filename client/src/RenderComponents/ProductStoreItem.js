import "../styles/product.css"

import {React, useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import axios from 'axios'

export default function ProductStoreItem(probs) {

    const row = probs.dataRow
    const [storeRow, setStoreRow] = useState([])
    const [avgPrice, setAvgPrice] = useState(0)
    const [saleInfo, setSaleInfo] = useState({})
    const [doneFetching, setDoneFetching] = useState(false)
    const avgDiff = saleInfo ? saleInfo.price - avgPrice : row.price - avgPrice

    let priceStatement = ""
    if (avgDiff === 0){
        priceStatement = "på niveau med"
    } else if (avgDiff > 0){
        priceStatement = "dyrere end"
    } else{
        priceStatement = "billigere end"
    }

    const navigate = useNavigate()

    /**
     * Retrieve information about the given product such as
     * information regarding the store, average price and status
     * on campaigns.
     */
    useEffect( () => {
        async function getStoreInfo(){
            const res = await axios.get("/store", {params: {storeId: row.store_id}})
            setStoreRow(res.data)
        }
        async function getAvgPrice(){
            const res = await axios.get("/avg-price", {params: {ean: row.product_ean,
                                                        store_id: row.store_id}})
            setAvgPrice(res.data[0].avg.toFixed(2))
        }

        async function getOnSale(){
            const res = await axios.get("/on-sale-today", {params: {ean: row.product_ean,
                                                            store_id: row.store_id}})
            if( res.data ){
                setSaleInfo(res.data[0])
            }
        }

        getStoreInfo()
        getAvgPrice()
        getOnSale()
        setDoneFetching(true)
    }, [row])

    function goToModel(){
        navigate("/model/" + row.product_ean + "/store/" + row.store_id)
    }

    /**
     * Render-component for products not on-sale
     */
    function renderRegular(){
        return (
            <>
                <div className="product--store--info--regular" onClick={() => goToModel()}>
                    <p className="product--pitch">Køb {row.contents} {row.contents_unit} for {row.price},- DKK</p>
                    <p>Varens pris er {priceStatement} gennemsnitsprisen</p>
                    <p>{storeRow.length > 0 ? storeRow[0].store_name : ""}</p>
                    <p className="product--disclaimer">{row.unit_price},- DKK/{row.unit}</p>
                    <p className="product--disclaimer">Gennemsnitspris: {avgPrice},- DKK </p>
                    
                </div>
                
            </>
        )
    }

    /**
     * Render-component for products on sale.
     */
    function renderOnSale(){
        return (
            <>
                <div className="product--store--info--sale" onClick={() => goToModel()}>
                    <p>TILBUD!</p>
                    <p className="product--pitch">Køb {saleInfo.quantity} × {saleInfo.contents} {saleInfo.contents_unit} for {saleInfo.price},- DKK</p>
                    <p>Varens pris er {priceStatement} gennemsnitsprisen</p>
                    <p>{storeRow.length > 0 ? storeRow[0].store_name : ""}</p>
                    <p className="product--disclaimer">{saleInfo.unit_price},- DKK/{saleInfo.unit}</p>
                    <p className="product--disclaimer">Gennemsnitspris: {avgPrice},- DKK </p>
                </div>
            </>
        )
    }

    function render(){
        return (saleInfo ? renderOnSale() : renderRegular() )
    }

    function loading(){
        return (
            <>
                <p>Produkt</p>
            </>
        )
    }

    return (doneFetching ? render() : loading())
}
