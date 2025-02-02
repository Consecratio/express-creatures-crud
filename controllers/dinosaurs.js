// bring in express and router
const express = require('express')
const router = express.Router()
const fs = require('fs')


/*~~ DINOSAUR ROUTES ~~*/

// GET /dinosaurs -- READ all dinos
router.get('/index', (req, res) => {
    // get JSONed dino data back from our DB
    const dinoData = refreshData()

    // send back the json
    res.render('dinosaurs/index.ejs', { dinoData: dinoData } )
})

// POST /dinosaurs -- CREATE a new dino
router.post('/index', (req, res) => {
    // get JSONed dino data back from our DB
    const dinoData = refreshData()

    // add data from the request body to the dino data
    dinoData.push(req.body)

    // write the json file
    writeToJSONFile(dinoData)

    // redirect to /dinosaurs
    res.redirect('/dinosaurs/index')
})

// GET /dinosaurs/new -- READ (show) a form to add a dino -- redirect to /dinosaurs
router.get('/new', (req, res) => {
    res.render('dinosaurs/new.ejs')
})

// GET /dinosaurs/:id -- READ one specific dino
router.get('/:id', (req, res) => {
    // get JSONed dino data back from our DB
    const dinoData = refreshData()

    // look up one dino with the request parameters
    const dino = dinoData[req.params.id]

    // send one dino back
    res.json( { dino } )
})

// GET /dinosaurs/edit/:id -- READ (show) form to edit one dino
router.get('/edit/:id', (req, res) => {
    // get JSONed dino data back from our DB
    const dinoData = refreshData()

    const dino = dinoData[req.params.id]
    // render the template
    res.render('dinosaurs/edit.ejs', { dino: dino , dinoId: req.params.id } )
})

// PUT /dinosaurs/:id -- UPDATE (edit) one dino -- redirect to /dinosaur/:id
router.put('/edit/:id', (req, res) => {
    // get JSONed dino data back from our DB
    const dinoData = refreshData()

    // find one dino from the req.params.id and use the req.body to update
    dinoData[req.params.id].name = req.body.name
    dinoData[req.params.id].type = req.body.type

    // write the json file
    writeToJSONFile(dinoData)

    // redirect to /dinosaurs
    res.redirect('/dinosaurs/index')
})

// DELETE /dinosaurs/:id -- DESTROY one specific dino
router.delete('/:id', (req, res) => {
    // get JSONed dino data back from our DB
    const dinoData = refreshData()

    // remove one dino from the array
    dinoData.splice(req.params.id, 1)

    // write the json file
    writeToJSONFile(dinoData)

    // redirect to /dinosaurs
    res.redirect('/dinosaurs/index')
})


/*~~ FUNCTIONS ~~*/

function refreshData() {
    const dinosaurs = fs.readFileSync('./dinosaurs.json')
    const dinoData = JSON.parse(dinosaurs)
    
    return dinoData
}

function writeToJSONFile(dinoData) {
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData))
}


module.exports = router