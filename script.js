let unit = "metric";

async function fetchWeather(city = "Lucknow") {
    try {
        const weatherRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${CONFIG.API_KEY}`
        );

        if (!weatherRes.ok) throw new Error("City not found");

        const weatherData = await weatherRes.json();

        const forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${CONFIG.API_KEY}`
        );

        const forecastData = await forecastRes.json();

        updateUI(weatherData, forecastData);

    } catch (error) {
        alert(error.message);
    }
}

async function fetchUV(lat, lon) {
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}`
    );
    const data = await res.json();
    return data.value;
}

async function updateUI(weather, forecast) {
    document.getElementById("cityName").textContent = weather.name;
    document.getElementById("temp").textContent =
        `${Math.round(weather.main.temp)}°`;

    document.getElementById("condition").textContent =
        weather.weather[0].description;

    document.getElementById("feelsLike").textContent =
        `${Math.round(weather.main.feels_like)}°`;

    document.getElementById("humidity").textContent =
        `${weather.main.humidity}%`;

    document.getElementById("wind").textContent =
        `${weather.wind.speed} m/s`;

    document.getElementById("pressure").textContent =
        `${weather.main.pressure} hPa`;

    document.getElementById("weatherIcon").src =
        `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

    document.getElementById("sunrise").textContent =
        new Date(weather.sys.sunrise * 1000).toLocaleTimeString();

    document.getElementById("sunset").textContent =
        new Date(weather.sys.sunset * 1000).toLocaleTimeString();

    const uv = await fetchUV(weather.coord.lat, weather.coord.lon);
    document.getElementById("uv").textContent = uv;

    renderHourly(forecast.list.slice(0, 8));
    renderDaily(forecast.list.filter((_, i) => i % 8 === 0));
}

function renderHourly(hours) {
    const container = document.getElementById("hourlyForecast");
    container.innerHTML = "";

    hours.forEach(hour => {
        container.innerHTML += `
            <div class="forecast-card">
                <p>${new Date(hour.dt * 1000).getHours()}:00</p>
                <img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}.png">
                <p>${Math.round(hour.main.temp)}°</p>
            </div>
        `;
    });
}

function renderDaily(days) {
    const container = document.getElementById("dailyForecast");
    container.innerHTML = "";

    days.slice(0, 5).forEach(day => {
        container.innerHTML += `
            <div class="forecast-card">
                <p>${new Date(day.dt * 1000).toLocaleDateString()}</p>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
                <p>${Math.round(day.main.temp)}°</p>
            </div>
        `;
    });
}

document.getElementById("searchBtn").addEventListener("click", () => {
    const city = document.getElementById("cityInput").value;
    fetchWeather(city);
});

document.getElementById("unitToggle").addEventListener("click", () => {
    unit = unit === "metric" ? "imperial" : "metric";
    document.getElementById("unitToggle").textContent =
        unit === "metric" ? "°F" : "°C";

    const city = document.getElementById("cityName").textContent;
    fetchWeather(city);
});

document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

fetchWeather();