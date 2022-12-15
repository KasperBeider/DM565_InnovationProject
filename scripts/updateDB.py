from salling_api import HEADER, PRODUCT_INFO_URL
from datetime import date
import json
import requests
import mysql.connector
import time

mydb = mysql.connector.connect(
    host="127.0.0.1",
    user="root",
    password="testpassword",
    database="innovationproject"
)
pull_date = date.today().strftime("%Y-%m-%d")
cursor = mydb.cursor()

# pull_date, store_id, product_ean, contents, contents_unit, from_date, to_date, price, quantity, unit, unit_price
SQL_CAMPAIGN = "INSERT IGNORE INTO campaigns VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"

# store_id, product_ean, pull_date, contents, contents_unit, desc, name, price, unit, unit_price
SQL_PRODUCTS = "INSERT IGNORE INTO products VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"

with open("sallingAPI\products\lookup_DB.json", "r", encoding="utf8") as lf:
    stores_and_products = json.load(lf)

    store_ids = stores_and_products["store_ids"]
    products = stores_and_products["products"]
    number_of_reqs = 0

    for store_id in store_ids:
        for product in products:
            for ean in product["eans"]:
                print("Trying to make request")
                
                payload = {
                    "storeId" : store_id
                }
                result = requests.get(PRODUCT_INFO_URL + str(ean), params=payload, headers=HEADER)
                json_obj = result.json()
                pretty = json.dumps(json_obj, indent=4, ensure_ascii=False)
                print("Current product:")
                print(pretty)

                ## Create standard product update
                if "instore" in json_obj:
                    print("Has \"instore\"")
                    instore_value = json_obj["instore"]
                    
                    contents = instore_value.get("contents", "")
                    contents_unit = instore_value.get("contentsUnit", "")
                    desc = instore_value.get("description", "")
                    name = instore_value.get("name", "")
                    price = instore_value.get("price", "")
                    unit = instore_value.get("unit", "")
                    unit_price = instore_value.get("unitPrice", "")


                    products_vals = (
                        store_id,
                        ean,
                        pull_date,
                        contents, 
                        contents_unit,
                        desc,
                        name,
                        price,
                        unit,
                        unit_price
                    )

                    cursor.execute(SQL_PRODUCTS, products_vals)
                    print(cursor.rowcount, "record inserted in products.")
                    mydb.commit()

                    ## Create campaign update
                    if "campaign" in instore_value:
                        print("Has campaign")
                        campaign_value = instore_value["campaign"]

                        contents = campaign_value.get("contents", "")
                        contents_unit = campaign_value.get("contentsUnit", "")
                        from_date = campaign_value.get("fromDate", "")
                        to_date = campaign_value.get("toDate", "")
                        price = campaign_value.get("price", "")
                        quantity = campaign_value.get("quantity", "")
                        unit = campaign_value.get("unit", "")
                        unit_price = campaign_value.get("unitPrice", "")

                        campaign_vals = (
                            pull_date,
                            store_id,
                            ean,
                            contents,
                            contents_unit,
                            from_date,
                            to_date,
                            price,
                            quantity,
                            unit,
                            unit_price
                        )

                        cursor.execute(SQL_CAMPAIGN, campaign_vals)
                        print(cursor.rowcount, "record inserted in campaign.")
                        mydb.commit()

                print("-----------------------------------")

                number_of_reqs += 1
                ## sleep on multiple requests
                if number_of_reqs == 4:
                    number_of_reqs = 0
                    time.sleep(10)

cursor.close()
mydb.close()

                

