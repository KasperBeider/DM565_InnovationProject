import React from 'react'
import "../styles/home.css"

export default function Home() {
    return (
        <div>
            <h1>Samarbejdspartnere</h1>
            <div className='home--display'>
                <div className='home--SallingGroup'>
                    <h1>Salling Group</h1>
                    <h2>Bilka</h2>
                    <h2>Føtex</h2>
                    <h2>Netto</h2>
                </div>
                <div className='home--Coop'>
                    <h1>COOP</h1>
                    <h2>Kvickly</h2>
                    <h2>coop365</h2>
                    <h2>Fakta</h2>
                </div>
            </div>
        </div>
    )
}
