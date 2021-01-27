import express from 'express'
import restaurants from './data/restaurants.json'

const PORT = process.env.PORT || 8000

const app = express()

// Debug endpoint to get all restaurants
app.get('/restaurants', (_req, res) => {
	res.send(restaurants)
})

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})