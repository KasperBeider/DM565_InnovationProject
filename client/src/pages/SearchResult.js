import React, { useState } from 'react'
import { useParams, useLocation, json } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'

export default function SearchResult() {

    const [productEan, setProductEan] = useState([])
    const [products, setProducts] = useState([])

    let {query} = useParams()

    // get product eans based on query
    useEffect( () => {
        setProducts([])

        async function getProductEans(){
            const res = await axios.get("/search", {params: {query: query}})
            let arr = []
            res.data.forEach(element => {
                arr.push(element.product_ean)
            });

            setProductEan(arr)
        }

        getProductEans()

    }, [query]);

    // get product info + min-price based on ean
    useEffect( () => {
        setProducts([])

        async function getProductInfo(ean){
            const res_info = await axios.get("/productinfo", {params: {ean: ean}})
            const res_min_price = await axios.get("/minprice", {params: {ean: ean}})
            const res_campaign = await axios.get("/campaign", {params: {ean: ean}})

            let product = res_info.data[0]
            product.minPrice = res_min_price.data

            if (res_campaign.data === null){
                product.campaign_unit_price = null
            } else {
                product.campaign_unit_price = res_campaign.data
            }

            setProducts( oldProducts => [...oldProducts, res_info.data[0]] )
        }
        productEan.forEach( ean => getProductInfo(ean))
    }, [productEan]);

    
    return (
        <>
            <div>
                <p>{query}</p>
                {productEan.map(ean => {
                    return <p>{ean}</p>
                })}

                {
                    products.map( product => {
                        return <p>{JSON.stringify(product)}</p>
                    })
                }
            </div>
        </>
    )
}
