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
    if (ValidateIPaddress(inputValue)) {
        updateInfo();
        setTimeout(() => {
            updateMap();
        }, "1000")

    } else {
        alert("You have entered an invalid IP address!");
    }
});

function ValidateIPaddress(ipaddress) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
        return true;
    }
    return false;
}

async function getData() {
    let url = 'https://ipgeolocation.abstractapi.com/v1/?api_key=6440c21ec108472aa292415b5396d054&ip_address=' + `${inputValue}`;

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
    ipAddress.innerHTML = data.ip_address;

    if (data.city != null) {
        physicalAddress.innerHTML = data.city + ', ' + data.region_iso_code + ' ' + data.postal_code;
    } else {
        physicalAddress.innerHTML = 'Unknown';
    }

    timezone.innerHTML = data.timezone.abbreviation + ' ' + data.timezone.current_time;

    isp.innerHTML = data.connection.isp_name;
}

updateInfo();

map = L.map('map', { zoomControl: false }).setView([51.505, -0.09], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


async function updateMap() {
    let data = await getData();

    map.setView([data.latitude, data.longitude]);

    let marker = L.marker([data.latitude, data.longitude]).addTo(map);
}

updateMap();