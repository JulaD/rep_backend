----Como correr los test ----

Para crear un test para un correspondiente archivo se debe proceder de la siguiente forma:
    -Para un archivo ```ejemplo.ts``` crear dentro de la carpeta __test__ un archivo llamado ```ejemplo.test.js```
    -Dentro del archivo ejemplo.test.ts incluir el archivo ejemplo.ts con ```const sum = require('./../ejemplo');```
    -Para cada función a probar ```funcionEjemplo(arg)``` la forma de diseñar un test es:
        -```test(Desc, () => {expect(funcionEjemplo(ejemploArg)).toBe(resultado);});```
    -Aqui los argumentos son:
        -```funcionEjemplo``` = es la funcion que esta siendo probada, que tiene como inputs ```arg```
        -```Desc```           = es un string, que debe describir brevemente el test que se lleva a cabo
        -```ejemploArg```     = son los argumentos con los cuales se testeará la ```funcionEjemplo```
        -```resultado```      = es el retorno esperado de ```funcionEjemplo``` con los argumentos ```ejemploArg```
    -Pueden agrupar los test con ```describe("Nombre del grupo de tests", () =>{}```, dentro de ese bloque se especifican los test al igual que antes, cambiando ```test``` por ```it```

Los tests son ejecutados de las siguientes formas:
    -Manualmente pueden ejecutarse todos mediante ```npm run test```
    -Individualmente cada test puede ser ejecutado con ```npm test -- -t "Nombre del test" ``` (El nombre es el argumento del ```describe``` previamente mencionado)
    -Alternativamente todos los test son ejecutados al llevar a cabo un push. Si uno de los test no es exitoso, el push no se lleva a cabo