import express from "express"
const app = express()
app.use(express.json())

import axios from "axios"
import currencyRoute from "./src/Routes/currencyRoute.js"
import cron from "node-cron"

app.use("/", currencyRoute)

import { db } from "./src/utils/dbConfig.js"

app.use("/testdb", async (req,res) => {
    const response = await axios.get('https://api.coingecko.com/api/v3/exchange_rates');
        const rates = response.data.rates;

        const cryptocurrencies = ['bitcoin', 'ethereum', 'litecoin'];
        const fiats = ['usd', 'eur', 'gbp'];

        console.log(rates.btc);


        const rates1 = [
            "Bitcoin", "usd", 100,
            "Bitcoin", "eur", 70,
        ]

        const query = `
                INSERT INTO rates (cryptocurrency, fiat, exchange_rate)
                VALUES ($1,$2,$3)`;

                db.query(query,rates1, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("success");
                }
              });


        for (const cryptocurrency of cryptocurrencies) {
            for (const fiat of fiats) {
              const exchangeRate = rates[fiat].value;
              // Update the 'rates' table in the database with the new exchange rate
              
            //   console.log('Exchange rates updated successfully');
            }
        }
})


cron.schedule('*/10 * * * * *', async () => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/exchange_rates');
        const rates = response.data.rates;

        const cryptocurrencies = ['bitcoin', 'ethereum', 'litecoin'];
        const fiats = ['usd', 'eur', 'gbp'];

        console.log(rates[aud]);

        for (const cryptocurrency of cryptocurrencies) {
            for (const fiat of fiats) {
              const exchangeRate = rates[fiat.toUpperCase()][cryptocurrency.toUpperCase()];
              // Update the 'rates' table in the database with the new exchange rate
              const query = `
                INSERT INTO rates (cryptocurrency, fiat, exchange_rate, timestamp)
                VALUES (?, ?, ?, NOW())
                ON DUPLICATE KEY UPDATE exchange_rate = VALUES(exchange_rate), timestamp = VALUES(timestamp)
              `;

              db.query(query, [cryptocurrency, fiat, exchangeRate]);
              console.log('Exchange rates updated successfully');
            }
        }

    } catch (error) {
        
    }
})

app.listen(8080, ()=> {
    console.log("server listening on 8080");
})