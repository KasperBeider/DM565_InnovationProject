import { useContext, useState, useEffect } from "react"
import { ShoppingListContext } from "../ShoppingListContext"
import axios from 'axios'
import ShoppingListItem from "../RenderComponents/ShoppingListItem"


export default function ShoppingList() {
    const {shoppingList, setShoppingList} = useContext(ShoppingListContext)

    useEffect( () => {
        const data = localStorage.getItem("SHOPPINGLIST")
        if (data) {
            setShoppingList(JSON.parse(data))
        }
    }, [])

    const [productsData, setProductsData] = useState([])
    const [allLists, setAllLists] = useState([])
    const temp_store_id = "64547bbb-bae4-4f93-ba06-18372c51e1a5"
    const storeIDs = ['64547bbb-bae4-4f93-ba06-18372c51e1a5', '895df17c-b8d3-47eb-8c46-fbde63c75058', 'b2c038d8-f0c0-4712-b145-b9336a041837',
                        'c4cba425-7f9c-475a-83ab-d51ed1907a0d', 'f897964d-2890-49bb-90f6-86f12b11afe6']



    async function getOffer(ean, store_id){
        const res_campaign = await axios.get("/on-sale-today", {params: {ean: ean, store_id: store_id} })

        if(res_campaign.data.length > 0){
            return res_campaign.data[0].price
        }
        else{
            return null
        }
    }

    async function calculateCombinedPrice(products, storeID){
        let sum = 0
        //console.log("products passed to calculateCombinedPrice", products)
        if(Array.isArray(products)){
            products.forEach(product => {
                //console.log("Product entry in the for each loop", product)
                let offerPrice = getOffer(product.product_ean, storeID)
                if(offerPrice) {
                    sum = sum + offerPrice
                }
                else {
                    sum = sum + product.price
                }
            })
        }

        return sum
    }

    useEffect( () => {
        console.log("Shopping list: ", shoppingList)
        let ean_string = ""
        shoppingList.forEach(element => {
            ean_string = ean_string + element + ","
        });
        ean_string = ean_string.slice(0,ean_string.length - 1)
        console.log("The ean string", ean_string)

        async function getProductStoreInfo(storeID){
            setProductsData([])
            const [res_product_info, res_store_info] = await Promise.all([axios.get("/store-shoppinglist-info", {params: {ean_numbers: ean_string, store_id: storeID}}),
                                                                            axios.get("/store", {params: {storeId: storeID}})])

            const combined_price_calcd = calculateCombinedPrice(res_product_info.data, storeID)
            if(Array.isArray(res_product_info.data)){
                res_product_info.data.forEach(product_info =>{
                    if(!productsData.includes(product_info)){
                        console.log("The product information:",product_info)
                        setProductsData(oldProductsData => ([
                            ...oldProductsData, product_info
                        ]))
                        console.log(res_product_info.data)
                    }
                } );
            }
            //console.log("The data in the productsdata state", productsData)
            const to_add = {
                store_id: res_store_info.data[0].store_id,
                store_name: res_store_info.data[0].store_name,
                combined_price: combined_price_calcd,
                product_info: productsData
            }
            setAllLists(oldAllLists => ([
                ...oldAllLists, to_add
            ]))
            // const res = await axios.get("/store-shoppinglist-info", {params: {ean_numbers: ean_string, store_id: temp_store_id} })
        }


        // async function getProductStoreInfo(storeID){
        //     const res = await axios.get("/store-shoppinglist-info", {params: {ean_numbers: ean_string, store_id: storeID} })
        //     if(Array.isArray(res.data)){
        //         res.data.forEach(product_info =>{
        //             if(!data.includes(product_info)){
        //                 setData(oldData => ([
        //                     ...oldData, product_info
        //                 ]))
        //             }
        //         } );
        //     }
        // }

        for(const storeID of storeIDs){
            getProductStoreInfo(storeID)
        }
    }, [shoppingList])
    // let combined_price = 0



    return (
        <div>
            <h1> Indkøbsliste </h1>
            {
                allLists.map( (list) => {
                    //console.log("The list in the rendering: ", list)
                    return (
                        <div>
                            <h1>Test</h1>
                            {/* <p> Butik: {list.store_name} </p>
                            <p> Den samlede pris: {list.combined_price} </p> */}

                        </div>
                    )
                })
            }
        </div>
    )


    // return (
    //     <div>
    //         <h1> Indkøbsliste </h1>
    //         {
    //             shoppingList.map( (product) => {
    //                 return <p> {product} </p>
    //             })
    //         }
    //         {
    //             data.map( (product_info) => {
    //                 if(product_info.campaign_unit_price) {
    //                     combined_price = combined_price + product_info.campaign_unit_price
    //                 }
    //                 else {
    //                     combined_price = combined_price + product_info.price
    //                 }
    //                 return <ShoppingListItem key = {product_info.product_ean} product = {product_info}/>
    //                 //return <p> {JSON.stringify(product_info)} </p>
    //             })
    //         }
    //         <p> Den samlede pris: {combined_price} DKK </p>
    //     </div>
    // )
}

