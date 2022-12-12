import "../styles/shoppinglist.css"

/**
 * Presents the individual items in the shoppinglist
 * @param {*} product 
 * @returns React Component
 */
export default function ShoppingListItem(product) {

    const thisProduct = product.product
    
    return ( thisProduct ? 
        <div className="shoppinglist--item">
            <p> Produktnavn: {thisProduct.product_name} </p>
            <p> Beskrivelse: {thisProduct.product_desc} </p>
            {thisProduct.campaign_unit_price && <p> Tilbudspris: {thisProduct.campaign_unit_price} DKK  </p> }
            {!thisProduct.campaign_unit_price && <p> Pris {thisProduct.price} DKK </p>}
            <p> {thisProduct.contents}{thisProduct.contents_unit} </p>
        </div>
        : <p>Indlæser</p>
    )
}