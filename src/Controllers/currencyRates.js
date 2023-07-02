import axios from "axios";
import Web3 from "web3"
import { db } from "../utils/dbConfig.js";

export const currencyRate = async (req,res)=> {

    try {
        const {crypto, fiat} = req.params
        // const response = await axios.get(
        //     `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${fiat}`
        // );
        let rate = null
        let data = null
        const query = `SELECT exchange_rate from rates WHERE cryptocurrency=$1 AND fiat=$2`
        db.query(query, [crypto,fiat], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                // rate = result.rows[0]?.exchange_rate
                console.log("rate=", rate);
                data = {
                    crypto,
                    fiat,
                    rate 
                }
                res.status(200).json(data)
                // console.log("success : ", result.rows[0]?.exchange_rate);
            }
        })

        // res.status(200).json(data)
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}


export const currencyBetween =  async (req, res) => {
    const { crypto } = req.params;
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd,eur,gbp`
      );

      const query = `SELECT fiat, exchange_rate from rates WHERE cryptocurrency=$1`
        db.query(query, [crypto], (err, result) => {
            if (err) {
                console.log(err);
            } else {

                let data = {
                    crypto : []
                }
                result.rows.map((fiat)=> {
                    let temp = {}
                    temp[`${fiat.fiat}`] = fiat.exchange_rate
                    data.crypto.push(temp)
                })

                console.log("success : ", data);
                res.status(200).json(data);
            }
        })

    //   const data = response.data;
    //   res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch exchange rates' });
    }
};

export const AllPairs =  async (req, res) => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin&vs_currencies=usd,eur,gbp');
      const rates = response.data;
      console.log(rates);
      res.status(200).json(rates);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch exchange rates' });
    }
};

export const HistoricalData = async (req, res) => {
    const { cryptocurrency, fiat } = req.params;
    const currentTime = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    const twentyFourHoursAgo = currentTime - 24 * 60 * 60;

    try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${cryptocurrency}/market_chart`,
          {
            params: {
              vs_currency: fiat,
              from: twentyFourHoursAgo,
              to: currentTime,
            },
          }
        );
    
        const prices = response.data.prices;
        const rateHistory = prices.map(([timestamp, rate]) => ({
          timestamp: timestamp * 1000, // Convert timestamp to milliseconds
          rate,
        }));
    
        res.json({ rateHistory });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch rate history' });
    }
}

export const getBalance =  async (req, res) => {
    
    const web3 = new Web3(`https://mainnet.infura.io/v3/${'YOUR_INFURA_PROJECT_ID'}`);

    const { address } = req.params;
    try {
      const balance = await web3.eth.getBalance(address);
      res.json({ balance });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch balance' });
    }
};