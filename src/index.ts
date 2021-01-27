import express from 'express'
import { getDistance } from 'geolib'
import { GeolibInputCoordinates } from 'geolib/es/types'
import restaurantsJSON from './data/restaurants.json'
const restaurants = restaurantsJSON.restaurants	// Get actual restaurants from JSON object

const PORT = process.env.PORT || 8000

const nearbyDistance = 1500	// Distance to filter nearby restaurants with, in meters

const app = express()

// Debug endpoint to get all restaurants
app.get('/restaurants', (_req, res) => {
	res.send(restaurantsJSON)
})

app.get('/discovery', (req, res) => {
	if (!req.query.lon || !req.query.lat) {	// Check that both parameters have been given
		res.status(400)	// 400 Bad Request
		res.send()
	} else {
		// Parse coordinates from query
		const coord: GeolibInputCoordinates = [Number(req.query.lon), Number(req.query.lat)]
		// Filter out restaurants based on distance
		const nearbyRestaurants = restaurants.filter((restaurant) => {return getDistance(coord, restaurant.location as GeolibInputCoordinates) <= nearbyDistance})
		res.send(nearbyRestaurants)
	}
})

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})