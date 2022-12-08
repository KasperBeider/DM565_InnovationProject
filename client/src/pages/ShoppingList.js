import { useContext, useState, useEffect } from "react"
import { ShoppingListContext } from "../ShoppingListContext"
import axios from 'axios'
import ShoppingListItem from "../RenderComponents/ShoppingListItem"


export default function ShoppingList() {
    


    const {shoppingList, setShoppingList} = useContext(ShoppingListContext)

    useEffect( () => {
        const data = localStorage.getItem("SHOPPINGLIST")
        if (data) { 
            console.log(data)
            setShoppingList(JSON.parse(data)) 
        }
    }, [])

    const [data, setData] = useState([])
    const temp_store_id = "64547bbb-bae4-4f93-ba06-18372c51e1a5"
    //const store_ids = ['64547bbb-bae4-4f93-ba06-18372c51e1a5', '895df17c-b8d3-47eb-8c46-fbde63c75058', 'b2c038d8-f0c0-4712-b145-b9336a041837', 
    //                    'c4cba425-7f9c-475a-83ab-d51ed1907a0d', 'f897964d-2890-49bb-90f6-86f12b11afe6']

    
    useEffect( () => {
        let ean_string = ""
        shoppingList.forEach(element => {
            ean_string = ean_string + element + ","
        });
        ean_string = ean_string.slice(0,ean_string.length - 1)
        console.log(ean_string)
        async function getProductStoreInfo(){
            const res = await axios.get("/store-basket-info", {params: {ean_numbers: ean_string, store_id: temp_store_id} })
            setData(res.data)
            console.log(res.data)
            console.log(data.length)
            console.log(data) 
        }

        getProductStoreInfo()
    }, [shoppingList])

    let combined_price = 0

    return (
        <div>
            <h1> Indkøbsliste </h1>
            {
                shoppingList.map( (product) => {
                    return <p> {product} </p>
                })
            }
            {
                data.map( (product_info) => {
                    combined_price = combined_price + product_info.price
                    return <ShoppingListItem key = {product_info.product_ean} product = {product_info}/>                    
                    //return <p> {JSON.stringify(product_info)} </p>
                })
            } 
            <p> Den samlede pris: {combined_price} DKK </p>
        </div>
    )

}

