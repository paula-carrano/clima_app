import 'dotenv/config'
import colors from 'colors';
import Busquedas from './models/busquedas.js';
import { inquirerMenu , pausa, leerInput,listarLugares} from './helpers/inquirer.js';

console.log(process.env.MAPBOX_KEY)
const main = async () => {
    
    const busquedas = new Busquedas(); 
    let opt;

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1 :

                const termino = await leerInput('Ciudad: ');
                const lugares = await busquedas.ciudad( termino );

                //Seleccionar el lugar
                const id = await listarLugares(lugares)
                if (id === 0) continue;
                const lugarSel = lugares.find(l=> l.id === id);
                const {nombre, lat,lng} = lugarSel;
                
                busquedas.agregarHistorial(nombre);

                //clima
                const clima = await busquedas.climaLugar(lat, lng)
                const {desc, min,max,temp} = clima;

                console.clear();
                console.log('\n Información de la ciudad \n'.brightBlue);
                console.log('Ciudad: ', nombre.yellow);
                console.log('Lat: ',lat);
                console.log('Lng: ',lng);
                console.log('Temperatura: ',temp);
                console.log('Mínima: ',min);
                console.log('Máxima: ',max);
                console.log('Como está el clima: ', desc.yellow);

            break;
            case 2 :
                busquedas.historialCapitalizado.forEach((lugar, i)=>{
                    const idx = `${i +1}.`.brightBlue;
                    console.log(`${idx} ${lugar}`);
                })
            break;   
        };

        if (opt !== 0) await pausa(); 
    
      } while (opt !== 0);
};

main();