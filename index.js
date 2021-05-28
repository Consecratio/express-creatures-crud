// required packages
const express = require('express')
// rowdy logger for logging our routes
const rowdy = require('rowdy-logger')
const fs = require('fs')

// config app
const app = express()
const rowdyResults = rowdy.begin(app)
const PORT = 3000
app.use(express.urlencoded( { extended: false } ))

// define routes
app.get('/', (req, res) => {
    res.json( { msg: 'Hello dinos!' })
})

// GET /dinosaurs -- READ all dinos
app.get('/dinosaurs', (req, res) => {
    // read the dino file
    const dinosaurs = fs.readFileSync('./dinosaurs.json')
    const dinoData = JSON.parse(dinosaurs)
    console.log(dinoData)
    // send back the json
    res.json({ dinoData })
})

// POST /dinosaurs -- CREATE a new dino
app.post('/dinosaurs', (req, res) => {
    // read dino file
    const dinosaurs = fs.readFileSync('./dinosaurs.json')
    const dinoData = JSON.parse(dinosaurs)

    console.log(req.body)
    // add data from the request body to the dino data
    dinoData.push(req.body)

    // write the file
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData))

    // redirect to /dinosaurs
    res.redirect('/dinosaurs')
})

// GET /dinosaurs/new -- READ (show) a form to add a dino -- redirect to /dinosaurs
app.get('/dinosaurs/new', (req, res) => {
    res.json( { msg: 'show form to add a dino' } )
})

// GET /dinosaurs/:id -- READ one specific dino
app.get('/dinosaurs/:id', (req, res) => {
    // get our dino data
    const dinosaurs = fs.readFileSync('./dinosaurs.json')
    const dinoData = JSON.parse(dinosaurs)

    // look up one dino with the request parameters
    const dino = dinoData[req.params.id]

    // send one dino back
    res.json( { dino } )
})

// GET /dinosaurs/edit/:id -- READ (show) form to edit one dino
app.get('/dinosaurs/edit/:id', (req, res) => {
    res.json( { msg: `show form to edit ${req.params.id}` } )
})

// PUT /dinosaurs/:id -- UPDATE (edit) one dino -- redirect to /dinosaur/:id
app.put('/dinosaurs/:id', (req, res) => {
    // get the dino data from our json
    const dinosaurs = fs.readFileSync('./dinosaurs.json')
    const dinoData = JSON.parse(dinosaurs)

    // find one dino from the req.params.id and use the req.body to update
    dinoData[req.params.id].name = req.body.name
    dinoData[req.params.id].type = req.body.type

    // write the json file
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData))

    // redirect to /dinosaurs
    res.redirect('/dinosaurs')
})

// DELETE /dinosaurs/:id -- DESTROY one specific dino
app.delete('/dinosaurs/:id', (req, res) => {
    // get our dino json
    const dinosaurs = fs.readFileSync('./dinosaurs.json')
    const dinoData = JSON.parse(dinosaurs)

    // remove one dino from the array
    dinoData.splice(req.params.id, 1)

    // write the json file
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData))

    // redirect to /dinosaurs
    res.redirect('/dinosaurs')
})

// listen on a port
app.listen(PORT, () => {
    rowdyResults.print()
    console.log(`Is that dinos I hear on port ${PORT}?`)
})