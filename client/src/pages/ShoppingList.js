import { useContext, useState, useEffect } from "react"
import { ShoppingListContext } from "../ShoppingListContext"
import axios from 'axios'
import ShoppingListItem from "../RenderComponents/ShoppingListItem"
import "../styles/shoppinglist.css"

/**
 * Displays the items in the shoppinglist for each store
 * Allows for resetting the list
 * Orders the lists with the cheapest store at the top
 * @returns React Component
 */
export default function ShoppingList() {
    const {shoppingList, setShoppingList} = useContext(ShoppingListContext)

    // Gets the persistent shoppinglist
    useEffect( () => {
        const data = localStorage.getItem("SHOPPINGLIST")
        if (data) {
            setShoppingList(JSON.parse(data))
        }
    }, [])
    const [allLists, setAllLists] = useState([])

    // Checks if a given product is on offer in that specific store
    async function getOffer(ean, store_id){
        const res_campaign = await axios.get("/on-sale-today", {params: {ean: ean, store_id: store_id} })

        if(res_campaign.data.length > 0){
            return res_campaign.data[0].price
        }
        else{
            return null
        }
    }

    // Goes through each item in the shoppinglist and retrieves information for those for each of the stores
    useEffect( () => {
        // Hardcoded store ids, would retrieve store_ids based on the location of the user
        const storeIDs = ['64547bbb-bae4-4f93-ba06-18372c51e1a5', '895df17c-b8d3-47eb-8c46-fbde63c75058', 'b2c038d8-f0c0-4712-b145-b9336a041837',
                        'c4cba425-7f9c-475a-83ab-d51ed1907a0d', 'f897964d-2890-49bb-90f6-86f12b11afe6']
        let ean_string = ""
        shoppingList.forEach(element => {
            ean_string = ean_string + element + ","
        });
        ean_string = ean_string.slice(0,ean_string.length - 1)

        // Calculates the price for all the items, checks if the item is on offer in the store
        async function calculateCombinedPrice(products, storeID){
            let sum = 0
            for(const item of products){
                let offerPrice = await getOffer(item.product_ean, storeID)
                if(offerPrice){
                    sum = sum + offerPrice
                } else{
                    sum = sum + item.price
                }
            }
            return sum
        }

        async function getProductStoreInfo(storeIDs){

            const arr = []
            for(const storeID of storeIDs){
                const [res_product_info, res_store_info] = await Promise.all([axios.get("/store-shoppinglist-info", {params: {ean_numbers: ean_string, store_id: storeID}}),
                                                                            axios.get("/store", {params: {storeId: storeID}})])

                const combined_price_calcd = await calculateCombinedPrice(res_product_info.data, storeID)
                const to_add = {
                    store_id: res_store_info.data[0].store_id,
                    store_name: res_store_info.data[0].store_name,
                    combined_price: combined_price_calcd,
                    product_data: res_product_info.data
                }

                arr.push(to_add)
            }
            setAllLists(arr)
            
        }
        // Check to see if the shoppinglist contains any items or not
        if(shoppingList.length > 0){
            getProductStoreInfo(storeIDs)
        }
    }, [shoppingList])

    // Sorts the finished list based on the combined price for the shoppinglist in each store
    allLists.sort((a,b) => parseFloat(a.combined_price) - parseFloat(b.combined_price))

    // Handler for clearing the shoppinglist
    function handleClick() {
        setShoppingList([])
        localStorage.setItem("SHOPPINGLIST", [])
    }

    // renders if there are objects in the list
    function renderItems(){
        return allLists.length > 0 ? allLists.map( (store_info_container) => { return(
            <div className="shoppinglist--store-container"> 
                <h1> {store_info_container.store_name} </h1>
                <div className="shoppinglist--store-items">
                    
                    {( store_info_container.product_data ?
                        store_info_container.product_data.map( (product) => <ShoppingListItem key = {(product.product_ean, store_info_container.store_id)} product={product}/>) : <p className="list--item--loading">Indlæser...</p>
                    )}
                </div>
                <p className="shoppinglist--combined-price"> Samlet pris: {store_info_container.combined_price},- DKK </p>
                <button className="shoppinglist--store-button"> Køb hos butik </button>
            </div>
        )
        }) : <p>Indlæser data...</p>
    }

    return (
        <div>
            <h1> Indkøbsliste </h1>
            { shoppingList.length > 0 && <button onClick={handleClick}> Ryd indkøbsliste </button>}
            { shoppingList.length > 0 ? renderItems() : <h3>Indkøbslisten er tom. Søg på et produkt og tilføj det til din kurv for at finde det her.</h3>}            
        </div>
    )
}

