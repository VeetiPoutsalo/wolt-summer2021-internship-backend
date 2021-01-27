import express from 'express'

const PORT = process.env.PORT || 8000

const app = express()

app.get('/', (_req, res) => {
	res.send('Hello World!')
})

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})