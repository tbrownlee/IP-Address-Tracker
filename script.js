'use strict'

let input = document.querySelector('.input');
let button = document.querySelector('.button');

let ipAddress = document.querySelector('.ip-address');
let physicalAddress = document.querySelector('.physical-address');
let timezone = document.querySelector('.timezone');
let isp = document.querySelector('.isp');

let map = document.querySelector('#map');

let inputValue = '';


button.addEventListener('click', () => {
    inputValue = input.value;
    updateInfo();
    updateMap();
});

async function getData() {
    let url = 'https://geo.ipify.org/api/v2/country,city?apiKey=at_WmvrUNIIPysjwd8StHd1sG40OlxLE&ipAddress=' + `${inputValue}`;

    try {
        let response = await fetch(url, {
            apiKey: '',
            ipAddress: inputValue,
            cache: 'no-cache',
        });

        return await response.json();
    } catch (error) {
        console.log(error);
    }
}

async function updateInfo() {
    let data = await getData();
    ipAddress.innerHTML = data.ip;

    physicalAddress.innerHTML = data.location.city + ', ' + data.location.region + ' ' + data.location.postalCode;

    timezone.innerHTML = data.location.timezone.abbreviation + ' ' + data.location.timezone;
    
    isp.innerHTML = data.isp;
}

updateInfo();

map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


async function updateMap() {
    let data = await getData();

    console.log(data);
    
    map.setView([data.location.lat, data.location.lng])
}

updateMap();