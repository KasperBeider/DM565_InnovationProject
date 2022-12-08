import React, { useState, useEffect, useRef } from 'react'
import { useParams} from 'react-router-dom'
import axios from 'axios'
import SearchResultItem from '../RenderComponents/SearchResultItem'
import "../styles/searchResult.css"

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

        async function getProductInfo(eans){
            console.log("inside product info")

            for(const ean of eans){
                const [res_info, res_min_price, res_campaign] = await Promise.all([axios.get("/productinfo", {params: {ean: ean}}),
                                                                               axios.get("/minprice", {params: {ean: ean}}),
                                                                               axios.get("/campaign", {params: {ean: ean}})])
                let product = res_info.data[0]
                product.minPrice = res_min_price.data
    
                if (res_campaign.data === null){
                    product.campaign_unit_price = null
                } else {
                    product.campaign_unit_price = res_campaign.data
                }
                
                setProducts( oldProducts => [...oldProducts, product] )
            }
        }
        getProductInfo(productEan)

        

    }, [productEan]);

    

    
    return (
        <>
            <div>
                <h1>Dit søgeresultat for {query}</h1>
                <div className='searchResult--container'>
                    {
                        products.map( product => {
                            return <SearchResultItem key = {product.product_ean} product_item = {product}/>
                        })
                    }
                </div>
            </div>
        </>
    )
}



// {productEan.map(ean => {
//     return <p>{ean}</p>
// })}