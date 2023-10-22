const express = require('express'); // Import Express
const Datastore = require('nedb');
require('dotenv').config();

const app = express(); // instantiate Express
const port = process.env.port || 9999;

app.listen(port,() =>
    console.log(`Starting server at ${port}`));
app.use(express.static('public')); //Serve up static files to our server
app.use(express.json({limit:'1mb'})); // Only take posts with less than 1mb

const database = new Datastore('database.db');
database.loadDatabase();


var fs = require('fs');

//Testing to see if this is on github

app.post('/api', (request,response) => {
    console.log('I got a request!');
    console.log(request.body);
    // Let's write this data to our txt file to persist forever.  This is a gimmicky solution since it exists on our local machine as a txt file

    // writeToFile(request.body.lat,request.body.long);
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data)

    response.json({
        status: 'success',
        timestamp: timestamp,
        latitude: request.body.lat,
        longitude: request.body.long,
        name: request.body.fname,
        city: data.city,
        country: data.country,
        temp: data.temp
    });
}); // Setting up the routing for our server; a post request.  The next step is to set up the fetch post on our client side and call this api on the server


app.get('/getWeather', async (req,res) => {
    try {
        const city = req.query.city;
        const apiKey = process.env.API_KEY;
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        res.json(data);
    } catch(error){
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }

    });



// Just a testing function to write to a local txt file.
async function writeToFile(lat,long) {
    fs.appendFile('geolocationHistory.txt',[Date.now().toString(),lat,long].toString().concat('\n'),function(err){
        if(err) throw err;
        console.log('Updated in geolocationHistory.txt!');
    });
};