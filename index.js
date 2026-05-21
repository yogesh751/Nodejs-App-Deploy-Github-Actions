import express from 'express'

const app = express()
const PORT = process.env.PORT ?? 8080

app.get('/', (req, res) => {
    return res.json({ msg: 'Hello from the Server.' })
})

app.listen(PORT, () => {
    console.log(`Server is up and running on PORT ${PORT}`)
})