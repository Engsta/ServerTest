

// Retrieve, display, and Send Geo and weather data to our server

const apiKey = '4cd635e0c7225a0f44c4db3dd4bcc899';

function geolocate() {
    navigator.geolocation.getCurrentPosition(async position => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        const city = await getCityFromCoordinates(lat,long);
        document.getElementById('latitude').textContent = lat;
        document.getElementById('longitude').textContent = long;
        const fname = document.getElementById('fname').value;

        // Let's also grab the weather today at the given city location
        const weatherData = await getWeatherData(city);
        const temp = weatherData.main.temp;
        const country = weatherData.sys.country;
        // console.log(weatherData);

        // let's send this data to the server using the server's /api
        const data = {lat,long,fname,city,temp,country};
        const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type':'application/json'
            }
        };
        const response = await fetch('/api',options);
        const json = await response.json();
        console.log(json);
})};


async function getWeatherData(city) {
    try {
        const response = await fetch(`/getWeather?city=${city}`);
        const data = await response.json();

        displayWeatherData(data);
        return data;
    } catch(error) {
        console.error('Error fetching weather data:', error);
    }
}

async function getCityFromCoordinates(lat, lon) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
        const data = await response.json();

        // Extract the city name from the response.
        const city = data.address.city;

        // Display the city name.
        console.log(`City: ${city}`);
        return city;
    } catch (error) {
        console.error('Error fetching location data:', error);
    }
}

function displayWeatherData(data){
    const weatherData = document.getElementById('weather-data'); // This is actually a pointer to the div on the HTML

    weatherData.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p>Temperature: ${data.main.temp}°C</p>
    <p>Weather: ${data.weather[0].description}</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed: ${data.wind.speed} m/s</p>
`;
}

