'use strict'

let input = document.querySelector('.input');
let button = document.querySelector('.button');

let ipAddress = document.querySelector('.ip-address');
let physicalAddress = document.querySelector('.physical-address');
let timezone = document.querySelector('.timezone');
let isp = document.querySelector('.isp');

let map = document.querySelector('#map');

let inputValue = '';



updateInfo();
updateMap();



map = L.map('map', { zoomControl: false }).setView([51.505, -0.09], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


button.addEventListener('click', () => {
    inputValue = input.value;
    if (ValidateIPaddress(inputValue)) {
        updateInfo();
        updateMap();
    } else {
        alert("You have entered an invalid IP address!");
        input.value = '';
    }
});

function ValidateIPaddress(ipaddress) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress.trim())) {
        return true;
    }
    return false;
}

async function getData() {
    let url = 'https://ipwho.is/' + `${inputValue}`;

    try {
        let response = await fetch(url, {
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

    console.log(data);

    ipAddress.innerHTML = data.ip;

    if (data.city != null) {
        physicalAddress.innerHTML = data.city + ', ' + data.region_code + ' ' + data.postal;
    } else {
        physicalAddress.innerHTML = 'Unknown';
    }

    timezone.innerHTML = data.timezone.abbr + ' ' + data.timezone.utc;

    isp.innerHTML = data.connection.isp;
}

async function updateMap() {
    let data = await getData();

    if (data.city == null) {
        return;
    }

    map.setView([data.latitude, data.longitude]);

    let marker = L.marker([data.latitude, data.longitude]).addTo(map);
}