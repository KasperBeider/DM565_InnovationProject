import { useNavigate } from "react-router-dom"
import "../styles/searchResult.css"

/**
 * Presents the individual results from the search
 * @param {*} product_item 
 * @returns React Component
 */
export default function SearchResultItem(product_item) {

    const thisProduct = product_item.product_item
    const navigate = useNavigate();

    function handleLinkFunction(query) {
        navigate("/product/" + query)
    }

    console.log(thisProduct)

    function displaySearchItem () {
        return (
            <div className="searchItem--container">
                <div className="searchItem--container" onClick={() => handleLinkFunction(thisProduct.product_ean)}>
                    <p> Navn: {thisProduct.product_name} </p>
                    <p> Beskrivelse: {thisProduct.product_desc}  </p>                
                    <p> Pris: fra {thisProduct.unit_price} DKK/{thisProduct.unit} </p>
                    {thisProduct.campaign_unit_price && <p> Tilbudspris: {thisProduct.campaign_unit_price} DKK  </p> }
                    <p> {thisProduct.contents}{thisProduct.contents_unit} </p>
                </div>
            </div>
        )
    }

    return (displaySearchItem())
}