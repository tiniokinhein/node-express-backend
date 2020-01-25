const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const passport = require('passport')


// Attch Mongodb
const dbConfig = require('./db/db')

// APIs Routes
const UserRoute = require('./routes/user.route')


// Connect Mongoose DB
mongoose.Promise = global.Promise
mongoose.connect(
    dbConfig.db,
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true
    }
)
.then(
    () => {
        console.log('Mongodb connected successfully!')
    },
    error => {
        console.log('Could not connect to Mongodb : ' + error)
    }
)


// Default App
const app = express()

app.use( bodyParser.json() )
app.use( bodyParser.urlencoded({ extended: true }) )
app.use( cors() )


// Passport Middle
app.use(passport.initialize())

// Passport config
require('./config/passport')(passport)


// Public File
app.use('/public', express.static(path.join(__dirname, 'public')))



// Routes
app.get('/', 
    (req, res) => res.sendFile(path.join(__dirname + '/public/index.html'))
)


app.use('/api/user', UserRoute)



// PORT
const port = process.env.PORT || 4000
app.listen(port, () => {
    console.log('Connected to ' + port)
})