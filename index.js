const API_KEY = "758081342dee422aef49a98acf5d54cc";

let horario = new Date();
let numDays = horario.getDay();
let days = ["Domingo","Lunes","Martes","Miércolres","Jueves","Viernes","Sábado"];
let daysData = [{},{},{},{},{}];
let minTemp = [];
let maxTemp = [];

const tempAct = document.querySelector(".temp-act");
const tempMin = document.querySelector(".temp-min");
const tempMax = document.querySelector(".temp-max");

const fiveDays = document.querySelector(".temp-pronostico");

const calcularMinTemp=(tempMin,tempMax)=>{
    let min = 999;
    let max = -999;

    for(const mins of tempMin)if(mins < min) min = mins;

    for(const maxs of tempMax)if(maxs > max) max = maxs;

    return [min,max];
}
const mostrarPronosticoFiveDays=(data)=>{
    numDays++
    if(numDays == 7) numDays = 0;
    const divMinMaxTemp = document.createElement("div");
    divMinMaxTemp.classList.add("nexts-days");
    divMinMaxTemp.innerHTML = `
        <span class="day">${days[numDays]}</span>
        <div>min: ${Math.round(data[0])}º</div>
        <div>max: ${Math.round(data[1])}º</div>
    `;
    fiveDays.appendChild(divMinMaxTemp);
}
const pronostico =(list)=>{
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

const mostrarTempAct=(dataTemp)=>{
    console.log(dataTemp);
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

navigator.geolocation.getCurrentPosition(position=>{
    const {latitude,longitude} = position.coords;
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`)
        .then(Response=>Response.json())
        .then(result => pronostico(result.list));
    
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`)
        .then(Response=>Response.json())
        .then(result => mostrarTempAct(result));
});    