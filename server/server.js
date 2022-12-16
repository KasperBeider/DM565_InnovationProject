const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const url = require('url')

const db = require('./database')

app.use(bodyParser.json())

/**
 * Find product eans whose name contains the query
 */
app.get("/search", (req, res) => {
    const queryObject = url.parse(req.url, true).query
    const query_string = queryObject.query.toString()
    const like_string = "%" + query_string + "%"
    
    SQL_QUERY = "SELECT DISTINCT product_ean FROM product_index WHERE product_name LIKE ?"

    db.query(SQL_QUERY, [like_string], (err, result) => {
        res.json(result)
    })
})

/**
 * Find the latest information for a given product (Only looking at the latest entry for that product)
 */
app.get("/productinfo", (req, res) => {
    const queryObject = url.parse(req.url, true).query
    const ean = queryObject.ean.toString()

    SQL_QUERY = "SELECT * FROM " +  
        "(SELECT * FROM products WHERE " +
            "pull_date = (SELECT MAX(pull_date) from products)" +
        ") AS IP WHERE " +
        "product_ean = ? " +
        "LIMIT 1"
    
    db.query(SQL_QUERY, [ean], (err, result) => {
        res.json(result)
    })
})

/**
 * Find the lowest price for a given product across stores
 * Only looking at the latest entries for that product (meaning it should be the most up to date)
 */
app.get("/minprice", (req, res) => {
    const queryObject = url.parse(req.url, true).query
    const ean = queryObject.ean.toString()

    SQL_QUERY = "SELECT MIN(unit_price) AS min FROM " +
	"(SELECT * FROM products WHERE " +
		"pull_date = (SELECT MAX(pull_date) from products)" +
	") AS IP WHERE product_ean = ?"

    db.query(SQL_QUERY, [ean], (err, result) => {
        res.json(result[0].min)
    })
})

/**
 * Gets the lowest offer price for a given product for any current campaigns
 */
app.get("/campaign", (req, res) => {
    const queryObject = url.parse(req.url, true).query
    const ean = queryObject.ean.toString()
    
    SQL_QUERY = "SELECT MIN(unit_price) AS min FROM campaigns WHERE to_date >= CURDATE() AND product_ean = ?"

    db.query(SQL_QUERY, [ean], (err, result) => {
        res.json(result[0].min)
    })
})

/**
 * Gets information for all the most recent entries for a given product
 */
app.get("/product-store-info", (req, res) => {
    const queryObject = url.parse(req.url, true).query
    const ean = queryObject.ean.toString()

    SQL_QUERY = "SELECT * FROM products WHERE product_ean = ?"
    + " AND pull_date = (SELECT MAX(pull_date) FROM products)"

    db.query(SQL_QUERY, [ean], (err, result) => {
        res.json(result)
    })
})

/**
 * Get information about a specific store from store_id
 */
app.get("/store", (req, res) => {
    const queryObject = url.parse(req.url, true).query
    const storeId = queryObject.storeId.toString()

    SQL_QUERY = "SELECT * FROM stores WHERE store_id = ?"

    db.query(SQL_QUERY, [storeId], (err, result) => {
        res.json(result)
    })
})

/**
 * Average the price for a given product in a given store over the last 30 days. 
 */
app.get("/avg-price", (req, res) => {
    const queryObject = url.parse(req.url, true).query
    const ean = queryObject.ean.toString()
    const storeId = queryObject.store_id.toString()

    SQL_QUERY = "SELECT AVG(price) AS avg FROM products WHERE product_ean = ?" +
                " AND store_id = ?" +
                " AND DATEDIFF(CURDATE(), pull_date) BETWEEN 0 AND 30"
    
    db.query(SQL_QUERY, [ean, storeId], (err, result) => {
        res.json(result)
    })
})

/**
 *  Retrieves information about a list of products
 *  given by EAN numbers in a given store.
 */
app.get("/store-shoppinglist-info", (req,res) => {
    const queryObject = url.parse(req.url, true).query
    const ean_numbers = queryObject.ean_numbers.toString()
    const storeId = queryObject.store_id.toString()
    

    SQL_QUERY = "SELECT * FROM products WHERE product_ean IN (" + ean_numbers + ")" +
                " AND store_id = ?" +
                " AND pull_date = (SELECT MAX(pull_date) FROM products)"
    
    db.query(SQL_QUERY, [storeId], (err, result) => {
        res.json(result)
    })
})

/**
 * Retrieves information about the on-sale status of a given
 * product with a given EAN number and Store ID.
 */
app.get("/on-sale-today", (req, res) => {
    const queryObject = url.parse(req.url, true).query
    const ean = queryObject.ean.toString()
    const storeId = queryObject.store_id.toString()

    SQL_QUERY = "SELECT * FROM campaigns WHERE product_ean = ? AND store_id = ? AND to_date >= CURDATE()"

    db.query(SQL_QUERY, [ean, storeId], (err, result) => {
        res.json(result)
    })
})

/**
 * Retrives information about the previous ordinary prices for a
 * product with a given EAN number.
 */
app.get("/product-history", (req, res) => {
    const queryObject = url.parse(req.url, true).query
    const ean = queryObject.ean.toString()
    const storeId = queryObject.store_id.toString()

    SQL_QUERY = "SELECT * FROM products WHERE product_ean = ? AND store_id = ? ORDER BY pull_date"

    db.query(SQL_QUERY, [ean, storeId], (err, result) => {
        res.json(result)
    })
})

/**
 * Retrieves information about the previous campaign prices for a 
 * product with a given EAN number.
 */
app.get("/campaign-history", (req, res) => {
    const queryObject = url.parse(req.url, true).query
    const ean = queryObject.ean.toString()
    const storeId = queryObject.store_id.toString()

    SQL_QUERY = "SELECT * FROM campaigns WHERE product_ean = ? AND store_id = ? ORDER BY pull_date"

    db.query(SQL_QUERY, [ean, storeId], (err, result) => {
        res.json(result)
    })
})

app.listen(5000, () => {
    console.log("Server started on port 5000")
})
