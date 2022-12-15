from datetime import date, timedelta
import os
import json
import random
import copy

date_pull = "2022-11-24"
date_vals = date_pull.split("-")
weeks_to_gen = 25       ## Half a year
percentage_lower = 0.05
percentage_upper = 0.15

for i in range(len(date_vals)):
    date_vals[i] = int(date_vals[i])

year, month, day = date_vals[0], date_vals[1], date_vals[2]

date_obj = date(year, month, day)

for (root, dirs, files) in os.walk("sallingAPI\stores"):
    
    if "products" in root:
        for product_files in files:
            file_path = os.path.join(root, product_files)
            
            # get current content
            fd = open(file_path, "r", encoding="utf8")
            original_content = json.load(fd)["products"]
            fd.close()

            new_data = []
            for product_item in original_content:
                for week_count in range(1, weeks_to_gen + 1):
                    new_pull_date = date_obj - timedelta((7*week_count))
                    try:
                        new_item = copy.deepcopy(product_item)
                        new_item["data"]["instore"].pop("campaign", None)
                        old_unit_price = new_item["data"]["instore"]["unitPrice"]
                        old_total_price = new_item["data"]["instore"]["price"]

                        ## 50% chance of changing price
                        change_price = random.randint(1,2)
                        if change_price == 1:
                            chosen_percentage = random.uniform(percentage_lower, percentage_upper)
                            # 80% chance of increasing price
                            price_direction = random.randint(1,5)
                            # Increase price
                            if price_direction > 1:
                                new_unit_price = old_unit_price * (1 + chosen_percentage)
                                new_total_price = old_total_price * (1 + chosen_percentage)
                            # Decrease price
                            else:
                                new_unit_price = old_unit_price * (1 - chosen_percentage)
                                new_total_price = old_total_price * (1 - chosen_percentage)
                            new_item["data"]["instore"]["price"] = round(new_total_price, 2)
                            new_item["data"]["instore"]["unitPrice"] = round(new_unit_price, 2)

                        new_item["pull_date"] = new_pull_date.strftime("%Y-%m-%d")
                        new_data.append(new_item)
                    except:
                        print("No given product in", file_path)
            original_content.extend(new_data)
            new_payload = {
                "products" : original_content
            }

            with open(file_path, "w", encoding="utf8") as nf:
                nf.write(json.dumps(new_payload, indent=4, ensure_ascii=False))

