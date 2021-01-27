import express from 'express'
import { getDistance } from 'geolib'
import { GeolibInputCoordinates } from 'geolib/es/types'
import restaurantsJSON from './data/restaurants.json'
import { Restaurant, Section, DiscoveryResult } from './types'
const restaurants = restaurantsJSON.restaurants as Restaurant[]	// Get actual restaurants from JSON object

const PORT = process.env.PORT || 8000

const maxSectionRestaurants = 10    	// Maximum restaurants in section
const nearbyDistance = 1500         	// Distance to filter nearby restaurants with, in meters
const newMaxAge = 4*30*24*60*60*1000	// Maximum age for 'new' restaurants, in milliseconds

const app = express()

// Debug endpoint to get all restaurants
app.get('/restaurants', (_req, res) => {
	res.send(restaurantsJSON)
})

// The types for this are a bit long, please excuse me for that :)
function createSection({result, restaurants, title, sortFunc, filterFunc}: {result: DiscoveryResult, restaurants: Restaurant[], title: string, sortFunc: (arg0: Restaurant, arg1: Restaurant) => number, filterFunc?: (arg0: Restaurant) => boolean | undefined}) {
	// Split restaurants into open (preferred) and closed
	const openRestaurants: Restaurant[] = []
	const closedRestaurants: Restaurant[] = []
	const filtered = filterFunc ? restaurants.filter(filterFunc) : restaurants	// Filter restaurants with extra filter if provided
	filtered.forEach((restaurant) => {	// We can use a single pass over the restaurants instead of two filters
		if (restaurant.online) {
			openRestaurants.push(restaurant)
		} else {
			closedRestaurants.push(restaurant)
		}
	})
	// Sort the restaurants
	openRestaurants.sort(sortFunc)
	closedRestaurants.sort(sortFunc)
	// Create our new section
	const section: Section = {
		title: title,
		restaurants: []
	}
	// Populate the new section from open restaurants
	section.restaurants = section.restaurants.concat(openRestaurants.splice(0, maxSectionRestaurants))
	if (section.restaurants.length < maxSectionRestaurants) { // If there's room, add closed restaurants
		section.restaurants = section.restaurants.concat(closedRestaurants.splice(0, maxSectionRestaurants - section.restaurants.length))
	}
	// Add the section to the result if it's not empty
	if (section.restaurants.length != 0) {
		result.sections.push(section)
	}
}

app.get('/discovery', (req, res) => {
	if (!req.query.lon || !req.query.lat) {	// Check that both parameters have been given
		res.status(400)	// 400 Bad Request
		res.send()
	} else {
		// Parse coordinates from query
		const coord: GeolibInputCoordinates = [Number(req.query.lon), Number(req.query.lat)]
		// Filter out restaurants based on distance
		const nearbyRestaurants = restaurants.filter((restaurant) => getDistance(coord, restaurant.location as GeolibInputCoordinates) <= nearbyDistance)
		// Create and populate sections
		const result: DiscoveryResult = {
			sections: <Section[]>[]
		}
		createSection({
			result: result,
			restaurants: nearbyRestaurants,
			title: 'Popular Restaurants',
			sortFunc: (a, b) => b.popularity - a.popularity	// Sort by popularity (descending)
		})
		createSection({
			result: result,
			restaurants: nearbyRestaurants,
			title: 'New Restaurants',
			sortFunc: (a, b) => new Date(b.launch_date).valueOf() - new Date(a.launch_date).valueOf(),	// Sort by age (ascending) / launch date (descending)
			filterFunc: (r) => Date.now().valueOf() - new Date(r.launch_date).valueOf() < newMaxAge   	// Filter with maximum age
		})
		createSection({
			result: result,
			restaurants: nearbyRestaurants,
			title: 'Nearby Restaurants',
			sortFunc: (a, b) => getDistance(coord, a.location as GeolibInputCoordinates) - getDistance(coord, b.location as GeolibInputCoordinates)	// Sort by distance (ascending)
		})
		// Send result as response
		res.send(result)
	}
})

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})