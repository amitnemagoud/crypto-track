import express from "express";
const router = express.Router()

import { AllPairs, HistoricalData, currencyBetween, currencyRate, getBalance } from "../Controllers/currencyRates.js";

router.get("/rates/:crypto/:fiat", currencyRate)
router.get("/rates/:crypto/", currencyBetween)
router.get("/rates", AllPairs)
router.get("/rates/history/:cryptocurrency/:fiat", HistoricalData)

router.get('/balance/:address', getBalance)

export default router