import React, { useState, useEffect, useMemo } from 'react';
import '../App.css';

function WeatherApp() {
  const [city, setCity] = useState('Chennai');
  const [weatherData, setWeatherData] = useState(null);
  const [inputValue, setInputValue] = useState('');

  
  const currentLocation = useMemo(() => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error('Error fetching location:', error);
            reject(null);
          }
        );
      } else {
        alert('Geolocation is not supported by this browser.');
        reject(null);
      }
    });
  }, []);

  const fetchWeather = (cityName) => {
    const apiKey = 'ac73eb7595344fcd99643605242110';
    const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=7&aqi=yes&alerts=no`;

    fetch(apiUrl)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('City not found');
        }
      })
      .then((data) => setWeatherData(data))
      .catch((error) => {
        console.error(error);
        alert('Error fetching data. Please try again.');
      });
  };

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const handleSearch = () => {
    if (inputValue) setCity(inputValue);
  };

  const handleClear = async () => {
    setInputValue('');
    try {
      const location = await currentLocation;
      if (location) {
        setCity(`${location.latitude},${location.longitude}`);
      }
    } catch {
      alert('Unable to retrieve current location.');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') handleSearch();
  };

  return (
    <div>
      <div className="searchbox">
        <input
          type="text"
          placeholder="Enter City Name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleClear}>Clear</button>
      </div>

      {weatherData && (
        <div className="container">
          <div id="result">
            <div className="top-container">
              <div className="contain">
                <h1 id="city">{`${weatherData.location.name}, ${weatherData.location.region}, ${weatherData.location.country}`}</h1>
                <p id="condition">Condition: {weatherData.current.condition.text}</p>
                <h1 id="temp">{weatherData.current.temp_c} °C</h1>
                <div className="sec-con">
                  <p id="max-temp">Max: {weatherData.forecast.forecastday[0].day.maxtemp_c} °C / </p>
                  <p id="min-temp">Min: {weatherData.forecast.forecastday[0].day.mintemp_c} °C</p>
                </div>
              </div>
              <img id="icon" src={weatherData.current.condition.icon} alt="Weather icon" />
            </div>

            <div className="second-container">
              <h3>Weather Forecast</h3>
              <div className="hours-card-crousel hours-card">
                {weatherData.forecast.forecastday[0].hour.map((hourData, index) => (
                  <div key={index}>
                    <p>{hourData.time.split(' ')[1]}</p>
                    <img src={hourData.condition.icon} alt="Weather icon" />
                    <p>{hourData.temp_c}°C</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="second-container">
              <h3>Air Conditions</h3>
              <div className="forcast-box">
                <div className="sub-box">
                  <label><u>Feels Like</u></label>
                  <h2 id="forecast">{weatherData.current.feelslike_c} °C</h2>
                  <label><u>Humidity</u></label>
                  <h2 id="humidity">{weatherData.current.humidity} %</h2>
                </div>
                <div className="sub-box">
                  <label><u>Wind Speed</u></label>
                  <h2 id="wind">{weatherData.current.wind_kph} km/h</h2>
                  <label><u>UV Index</u></label>
                  <h2 id="uv">{weatherData.current.uv}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="left-box">
            <h1>7-Days Forecast</h1>
            <div id="forecast-container">
              {weatherData.forecast.forecastday.map((day, index) => (
                <div key={index} className="forecast-day">
                  <div className="day">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <div className="temp">{day.day.maxtemp_c}°C / {day.day.mintemp_c}°C</div>
                  <div className="weather">
                    <img src={day.day.condition.icon} alt="Weather icon" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;
