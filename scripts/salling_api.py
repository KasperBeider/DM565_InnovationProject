TOKEN = "32c4bcae-351d-4fab-9230-ea763f7f13b0"
HEADER = {
    "Authorization" : "Bearer " + TOKEN
}
BASE_URL = "https://api.sallinggroup.com"


# /v1/food-waste/{id}
FOOD_WASE_URL = BASE_URL + "/v1/food-waste"


# /v1-beta/product-suggestions/relevant-products?query=
PRODUCT_SUGG_RELEVANT_URL = BASE_URL + "/v1-beta/product-suggestions/relevant-products"
PRODUCT_SUGG_SIMILAR_URL = BASE_URL + "/v1-beta/product-suggestions/similar-products"
PRODUCT_INFO_URL = BASE_URL + "/v2/products/"
STORE_IDS = BASE_URL + "/v2/stores/"


payload_relevant = {
    "query" : "kakao"
}

payload_similar = {
    "productId" : "19668"
}

payload_stores = {
    "per_page" : 2000
}