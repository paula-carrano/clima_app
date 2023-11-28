import inquirer from 'inquirer';
 
import colors from 'colors';
 
const menuOpts = [
  {
    type: 'list',
    name: 'opcion',
    message: '¿Qué desea hacer?',
    choices: [
      {
        value: 1, 
        name:`${'1.'.brightBlue} Buscar ciudad`
      },
      {
        value: 2, 
        name:`${'2.'.brightBlue} Historial`
      },
      {
        value: 0, 
        name:`${'0.'.brightBlue} Salir`
      }
    ]
  }
];


 
const inquirerMenu = async () => {
  console.clear();
  console.log('==========================='.brightBlue);
  console.log('   Seleccione una opción'.white);
  console.log('===========================\n'.brightBlue);
 
  const {opcion} = await inquirer.prompt(menuOpts);
 
  return opcion;
};

const pausa = async () => {
  const question = [
    {
      type: 'input',
      name: 'confirmacion',
      message: `Presione ${'ENTER'.blue} para continuar`
    }];
  
  console.log('\n');
  await inquirer.prompt(question);
};
 
const leerInput = async(message) => {

  const question = [
    {
      type: 'input',
      name: 'desc',
      message,
      validate(value){
        if (value.length === 0){
          return 'Por favor ingrese un valor'
        }
        return true;
      }
    }
  ];

const {desc} = await inquirer.prompt(question);
return desc
};

const listarLugares = async(lugares = []) =>{

  const choices = lugares.map((lugar, i) => {
    const idx = `${i+1}`.brightBlue 
    const {id,nombre} = lugar

    return {
      value: id,
      name: `${idx} ${nombre}`
    }
  });

  choices.unshift({
    value: 0,
    name: '0.'.brightBlue  + 'Cancelar'
  })

  const preguntas = [
    {
      type: 'list',
      name: 'id',
      message: 'Seleccione lugar:',
      choices
    }
  ];

  const {id} = await inquirer.prompt(preguntas);

  return id;
};


export { inquirerMenu, pausa, leerInput,listarLugares};
