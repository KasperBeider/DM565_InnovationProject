import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import {XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, MarkSeries} from 'react-vis'
import "../../node_modules/react-vis/dist/style.css"
import "../styles/model.css"

export default function Model() {
    const {ean, storeId} = useParams()
    const [history, setHistory] = useState([])
    const [campaignHist, setCampaignHist] = useState([])
    const [campaignGraphVals, setCampaignGraphVals] = useState([])
    const [graphVals, setGraphVals] = useState([])

    /**
     * Retrieve general product history as well as campaign history
     * of the given product on each render.
     */
    useEffect( () => {
        async function getHistory(){
            const res = await axios.get("/product-history", {params: {ean: ean, store_id: storeId}})
            setHistory(res.data)
        }
        async function getCampaignHistory(){
            const res = await axios.get("/campaign-history", {params: {ean: ean, store_id: storeId}})
            const data = res.data
            const arr = []
            for(const row of data){
                const toAdd = {
                    to_date: row.to_date,
                    from_date: row.from_date,
                    campaign_price: row.price
                }
                arr.push(toAdd)
            }
            setCampaignHist(arr)
        }

        getHistory()
        getCampaignHistory()
    }, [ean, storeId])

    /**
     * Create data points for the LineSeries.
     * Campaign points are inserted into their own data set
     * to be plotted separately.
     */
    useEffect( () => {
        let i = 0
        const arr = []
        const camp = []
        for(const row of history){
            // check if item has campaign at this pull date
            const possibleCampaign = campaignHist.filter( element => element.to_date >= row.pull_date && row.pull_date >= element.from_date)
            if ( possibleCampaign.length > 0){
                const campaign = {
                    x: i,
                    y: possibleCampaign[0].campaign_price,
                    size: 4
                }
                camp.push(campaign)
            }
            const toAdd = {
                x: i,
                y: row.price
            }
            arr.push(toAdd)
            i = i + 1
        }
        setGraphVals(arr)
        setCampaignGraphVals(camp)
    }, [history, campaignHist])

    return (
        <>
            <h1>Model</h1>
            <div className='model--container'>
                <XYPlot height={600} width={1200}>
                    <LineSeries data={graphVals} opacity={0.5} color="black"/>
                    <MarkSeries data={campaignGraphVals} color="orange"/>
                    <VerticalGridLines/>
                    <HorizontalGridLines />
                    <XAxis title='Dato' style={{text: {fill: "black"}}}/>
                    <YAxis title='Pris' style={{text: {fill: "black"}}}/>
                </XYPlot>
            </div>
        </>
    )
}
