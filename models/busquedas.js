import fs from 'fs';
import axios from 'axios';

class Busquedas {

    historial = [] ; 
    dbPath = './db/historial.json';

    constructor() {
        this.leerDB();
    }

    get historialCapitalizado() {
        return this.historial.map( lugar => {

            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );

            return palabras.join(' ')
        });
    }

    get paramsMapBox() {
        
        return {
                'access_token': process.env.MAPBOX_KEY,
                'limit':5,
                'language':'es'   
        }
    }


    get paramsWeather(){
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }

    async ciudad (lugar = '') {

        try{
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapBox
            })

            const respuesta = await instance.get()
            return respuesta.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }))

        }catch (err) { 
            return [];   
        }
    }

    async climaLugar (lat,lon) {
        try {
            const instance= axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsWeather, lat, lon}
            });

            const respuesta = await instance.get()
            const {weather, main} = respuesta.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial( lugar = '' ) {

        if( this.historial.includes( lugar.toLocaleLowerCase() ) ){
            return;
        }
        this.historial = this.historial.splice(0,5);
    
        this.historial.unshift( lugar.toLocaleLowerCase() );
    
            // Grabar en DB
        this.guardarDB();
    }
    
    guardarDB() {

        const payload = {
            historial: this.historial
        };

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ) );

    }

    leerDB(){
        if ( !fs.existsSync( this.dbPath ) ) return;
        
        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8' });
        const data = JSON.parse( info );

        this.historial = data.historial;
    }
};


export default  Busquedas;