# Node Test Django-WS4Redis


## Instalación
> Si desea trabajar con vagrant primero siga la documentación en el archivo `./docs/doc_vagrant.md` y posteriormente continue esta documentación. 

Instalar las dependencias del proyecto colocandose en la raíz y ejecutar el comando.
```bash
npm install
```

## Uso

Mandar a ejecutar el archivo `index.js` con node.
```bash
node src/index.js
```

### Especificar el número de ws
Este script contiene argumentos permitidos los cuales son:

- --host, Corresponde host del server. 
  - Si no se especifica su valor por default es 'localhost'.
- --total, Corresponde al numero de websockets a trabajar. 
  - Si no se especifica su valor por default es 1.
- --prefix, Identificador en los logs de salida
  - Si no se especifica su valor sera generado por una serie aleatoria de caracteres de tamaño 5

```bash
node src/index.js --host=projectwebsocket.net --total=15 --prefix=test001
```

### Guardar logs
Para guardar los logs en un archivo de texto ejecute agregar esta instruccion al comando anterior "`>> logs_test01.txt`".
```bash
node src/index.js --host=projectwebsocket.net --total=15 --prefix=test001 >> logs_test01.txt
```

Si desea visualizar como se va actualizando el archivo puede usar el comando `tail` (asumiendo que trabaja en Linux).
```bash
tail -f logs_test01.txt
```
