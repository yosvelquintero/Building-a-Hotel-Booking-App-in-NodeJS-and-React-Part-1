// router.js
const Amadeus = require('amadeus')
const express = require('express')

const { API_KEY, API_SECRET } = require('./config')

// Create router
const router = express.Router()

// Create Amadeus API client
const amadeus = new Amadeus({
  clientId: API_KEY,
  clientSecret: API_SECRET,
})

const API = 'api'

// City search suggestions
router.get(`/${API}/search`, async (req, res) => {
  try {
    const { keyword } = req.query
    const response = await amadeus.referenceData.locations.get({
      keyword,
      subType: Amadeus.location.city,
    })
    return res.json(JSON.parse(response.body))
  } catch (err) {
    return res.json(err)
  }
})

// Querying hotels
router.get(`/${API}/hotels`, async (req, res) => {
  try {
    const { cityCode, checkInDate, checkOutDate } = req.query
    const response = await amadeus.shopping.hotelOffers.get({
      cityCode,
      checkInDate,
      checkOutDate,
    })

    return res.json(JSON.parse(response.body))
  } catch (err) {
    return res.json(err)
  }
})

// Querying hotel offers
router.get(`/${API}/offers`, async (req, res) => {
  try {
    const { hotelId } = req.query
    const response = await amadeus.shopping.hotelOffersByHotel.get({
      hotelId,
    })

    return res.json(JSON.parse(response.body))
  } catch (err) {
    return res.json(err)
  }
})

// Confirming the offer
router.get(`/${API}/offer`, async (req, res) => {
  try {
    const { offerId } = req.query
    const response = await amadeus.shopping.hotelOffer(offerId).get()

    return res.json(JSON.parse(response.body))
  } catch (err) {
    return res.json(err)
  }
})

// Booking
router.post(`/${API}/booking`, async (req, res) => {
  try {
    const {
      query: offerId,
      body: { guests, payments },
    } = req
    const response = await amadeus.booking.hotelBookings.post(
      JSON.stringify({
        data: {
          offerId,
          guests,
          payments,
        },
      })
    )

    return res.json(JSON.parse(response.body))
  } catch (err) {
    return res.json(err)
  }
})

module.exports = router
