const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const url = require('url')

const db = require('./database')

app.use(bodyParser.json())

app.get("/search", (req, res) => {
    const queryObject = url.parse(req.url, true).query
    const query_string = queryObject.query.toString()
    const like_string = "%" + query_string + "%"
    
    SQL_QUERY = "SELECT DISTINCT product_ean FROM product_index WHERE product_name LIKE ?"

    db.query(SQL_QUERY, [like_string], (err, result) => {
        res.json(result)
    })
})

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

app.get("/campaign", (req, res) => {
    const queryObject = url.parse(req.url, true).query
    const ean = queryObject.ean.toString()
    
    SQL_QUERY = "SELECT MIN(unit_price) AS min FROM campaigns WHERE to_date > CURDATE() AND product_ean = ?"

    db.query(SQL_QUERY, [ean], (err, result) => {
        console.log("Campaign:", result)
        res.json(result[0].min)
    })
})












app.listen(5000, () => {
    console.log("Server started on port 5000")
})
