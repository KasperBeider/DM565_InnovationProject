import json
import os
import matplotlib.pyplot as plt
import nitime as nt
import numpy as np

eans_and_unit_prices = {}
with open("sallingAPI\stores\Bilka_Odense\products\Hvedemel.json", "r", encoding="utf8") as fp:
    content = json.load(fp)["products"]
    sorted_content = sorted(content, key=lambda product: product["pull_date"], reverse=False)

    for products in sorted_content:
        campaign = "campaign" in products["data"]["instore"]
        unit_price = products["data"]["instore"]["unitPrice"]

        ## Produce [date, unit_price] or [date, unit_price_campaign, "campaign", old_unit_price] depending on campaign
        dataPoint = [products["pull_date"], unit_price] if not campaign else [products["pull_date"], products["data"]["instore"]["campaign"]["unitPrice"], "campaign", products["data"]["instore"]["unitPrice"]]
            
        if products["ean"] in eans_and_unit_prices:
            eans_and_unit_prices[products["ean"]].append(dataPoint)
        else:
            eans_and_unit_prices[products["ean"]] = [dataPoint]

fig, plots = plt.subplots(1, 3, figsize=(18, 8))

plot_count = 0
for eans in eans_and_unit_prices:
    print("Ean:", eans)
    print("Data points:")
    print(eans_and_unit_prices[eans])
    time_price = eans_and_unit_prices[eans]
    
    ## real prices
    x_vals = [i for i in range(0, len(time_price))]
    y_vals = []
    
    ## for the model, without campaigns
    model_prices = []
        
    ## Points for campaigns
    campaign_x_vals = []
    campaign_y_vals = []

    for n in range(len(time_price)):
        current_price_data = time_price[n]
        
        if len(current_price_data) == 4: ## campaign
            campaign_x_vals.append(n)
            campaign_y_vals.append(current_price_data[1])
            model_prices.append(current_price_data[3])  ## append old price
        else:
            model_prices.append(current_price_data[1])  ## append current non-campaign price
        
        y_vals.append(current_price_data[1]) ## append unit price to given date, regardless of campaign
            
            
    xs = np.array(x_vals)
    ys = np.array(y_vals)
    model_ys = np.array(model_prices)

    order = 4
    rhos, new_val = nt.algorithms.autoregressive.AR_est_YW(model_ys, order)
    constant = np.average(model_ys) * (1 - np.sum(rhos))
    actual_prediction = 0

    model_y_vals = []
    model_x_vals = [i for i in range(order, ys.size + 1)]

    ## Make predictions from the first four points up until the last four points, creating a predictive background model
    for k in range(order - 1, model_ys.size):
        new_prediction = 0
        for j in range(order):
            new_prediction += model_ys[k - j] * rhos[j]
        new_prediction += constant
        model_y_vals.append(new_prediction)
    
    ## reverse y-vals
    model_y__vals = model_y_vals[::-1]
    print("Rhos:", rhos)
    print("New_Value:", new_val)
    print("Constant:", constant)
    print("Actual_Prediction:", actual_prediction)
    print("New Predictions:", model_y_vals)
    print("Number of predictions:", len(model_y_vals))
    print("Model x_vals:", model_x_vals)
    print("Data x_vals:", xs)

    plots[plot_count].set_title(eans)
    plots[plot_count].plot(xs, ys, linewidth=2) ## actual date and price
    plots[plot_count].plot(model_x_vals, model_y_vals, linewidth=1, alpha=0.4) ## model date and price
    plots[plot_count].plot(campaign_x_vals, campaign_y_vals, marker="o", markeredgecolor="red")
    plots[plot_count].grid()
    plot_count += 1

fig.suptitle("Hvedemelspriser")
plt.show()