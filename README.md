# Node Test Django-WS4Redis

## Prerequisitos
> Si desea trabajar con vagrant primero siga la documentación en el archivo [./docs/doc_vagrant.md](https://github.com/fernandoperezwh/Node-Test-Django-WS4Redis/blob/master/docs/doc_vagrant.md) y posteriormente continue esta documentación. 


### Instalar Node Version Manager
Se instala NVM para poder manejar diferente versiones de node. Estas instrucciones fueron tomadas del [repositorio oficial](https://github.com/nvm-sh/nvm#installing-and-updating)

1. Asegurese de tener instalado git con el comando "`git --version`". Si no lo tiene debera instalarlo.

2. Ejecute el script de instalación. Debera descargarlo y ejecutarlo manualmente. Utilice el siguiente comando cURL o Wget.
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
    ```
    ```bash
    wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
    ```
3. El script de instalacion genera una secuencia de comandos que clona el repositorio nvm en ~/.nvm __e intenta agregar las líneas de origen del fragmento al archivo de perfil correcto__ (~/.bash_profile, ~/.zshrc, ~/.profile o ~/.bashrc).

    Verifique que el contenido siguiente se encuentre en alguno de los archivos anteriormente mencionados. Si no se encuentra, entonces agregelo copiando estas lineas al final del archivo `~/.bashrc`

    ```txt
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
    ```

4. Recargue las configuraciones del shell
    ```bash
    source ~/.bashrc
    ```

5. Asegurese que se encuentre el comando de `nvm`.
    ```bash
    nvm --version
    ```

### Instalar Node y NPM

Hasta este momento NO hemos instalado Node. Utilizaremos NVM para hacerlo.

1. Este proyecto fue elaborado en Node v17.1.0. Por lo tanto, instalaremos esa version de Node con el siguiente comando
    ```bash
    nvm install 17.1.0
    ```
2. Verifique que la version de node corresponda con el comando
    ```bash
    node --version
    ```
3. NPM se instala junto con Node. Por lo tanto, verifique que se encuentre disponible el comando
    ```bash
    npm --version
    ```


## Instalación de dependencias

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

```bash
node src/index.js --host=projectwebsocket.net --total=15
```

### Guardar logs
Para guardar los logs en un archivo de texto ejecute agregar esta instruccion al comando anterior "`>> logs_test01.txt`".
```bash
node src/index.js --host=projectwebsocket.net --total=15 >> logs_test01.txt
```

Si desea visualizar como se va actualizando el archivo puede usar el comando `tail` (asumiendo que trabaja en Linux).
```bash
tail -f logs_test01.txt
```
