const API_KEY = "758081342dee422aef49a98acf5d54cc";

let horario = new Date();
let numberDayACtual = horario.getDay();
let days = ["Domingo","Lunes","Martes","Miércolres","Jueves","Viernes","Sábado"];
let daysData = [{},{},{},{},{}];
let minTemp = [];
let maxTemp = [];

const tempAct = document.querySelector(".temp-act");
const tempMin = document.querySelector(".temp-min");
const tempMax = document.querySelector(".temp-max");

const fiveDays = document.querySelector(".temp-pronostico");

const modalLoading = document.querySelector(".modal-loading");

const calcularMinTemp=(tempMin,tempMax)=>{
    let min = 999;
    let max = -999;

    for(const mins of tempMin)
        if(mins < min) min = mins;

    for(const maxs of tempMax)
        if(maxs > max) max = maxs;

    return [min,max];
}
const mostrarPronosticoFiveDays=(tempMinMax)=>{
    numberDayACtual++
    if(numberDayACtual == 7) numberDayACtual = 0;
    const divMinMaxTemp = document.createElement("div");
    divMinMaxTemp.classList.add("nexts-days");
    divMinMaxTemp.innerHTML = `
        <span class="day">${days[numberDayACtual]}</span>
        <div>min: ${Math.round(tempMinMax[0])}º</div>
        <div>max: ${Math.round(tempMinMax[1])}º</div>
    `;
    fiveDays.appendChild(divMinMaxTemp);
}
const pronostico =(list)=>{
    modalLoading.style.display = 'none';
    let limit = 8;
    let iterator = 0;
    for(let i=1;i<list.length;i++){
        minTemp[iterator] = list[i].main.temp_min;
        maxTemp[iterator] = list[i].main.temp_max;
        iterator++;
        if(i == limit){
            let minMax = calcularMinTemp(minTemp,maxTemp);
            mostrarPronosticoFiveDays(minMax);
            iterator = 0;
            if(limit==32)limit = 39;
            else limit+=8;
        }
    }
}

const showTempActual=(dataTemp)=>{
    const {temp,temp_min,temp_max,feels_like,humidity,pressure} = dataTemp.main;
    tempAct.textContent = Math.round(temp)+"º";
    tempMin.textContent = "min: "+temp_min+"º";
    tempMax.textContent = "max: "+temp_max+"º";
    document.querySelector(".feels_like").textContent += feels_like+"º";
    document.querySelector(".humidity").textContent += humidity+"%";
    document.querySelector(".pressure").textContent += pressure;
    document.querySelector(".wind").textContent += dataTemp.wind.speed;
    document.querySelector(".description").textContent += dataTemp.weather[0].description;
}


const getForecast =( latitude, longitude )=>{
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`)
    .then(Response=>Response.json())
    .then(result => pronostico(result.list));
}

function getWeatherActuality( latitude, longitude ){
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`)
    .then(Response=>Response.json())
    .then(result => showTempActual(result));
}

async function getApi(latitude, longitude ){
    await getWeatherActuality(latitude, longitude );
    await getForecast(latitude, longitude );
}

navigator.geolocation.getCurrentPosition(position=>{
    const {latitude,longitude} = position.coords;

    modalLoading.style.display = 'flex';
    getApi( latitude, longitude );
});    