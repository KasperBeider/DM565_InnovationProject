import React, { useState, useEffect } from 'react'
import { useParams} from 'react-router-dom'
import axios from 'axios'
import SearchResultItem from '../RenderComponents/SearchResultItem'
import "../styles/searchResult.css"

/**
 * Displays the products whose names consists of the query given by the user.
 * Only display the smallest price for each product on this page.
 * @returns React Component
 */
export default function SearchResult() {

    const [productEan, setProductEan] = useState([])
    const [products, setProducts] = useState([])

    let {query} = useParams()

    // get product eans based on query
    useEffect( () => {
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
        async function getProductInfo(eans){

            const arr = []
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

                arr.push(product)             
                
            }
            setProducts(arr)
        }
        getProductInfo(productEan)

        

    }, [productEan]);

    

    
    return (
        <>
            <div>
                <h1>Dit søgeresultat for {query}</h1>
                <div className='searchResult--container'>
                    {
                        products.length > 0 ? products.map( product => {
                            return <SearchResultItem key = {product.product_ean} product_item = {product}/>
                        }) : <p>Indlæser data...</p>
                    }
                </div>
            </div>
        </>
    )
}