# Ejecutar en un Vagrant

En esta guia se asume que tiene instalado Vagrant.

---


## Iniciar la maquina virtual
1. Ejecute el siguiente comando para cargar la maquina virtual de un ubuntu 20.04.3 LTS
    ```bash
    vagrant up
    ```
2. Conectese a la VM creada anteriormente por medio de ssh con el comando
    ```bash
    vagrant ssh
    ```

## Instalar Node Version Manager
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

## Instalar Node y NPM

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


## Nota:
Para probar el proyecto que corre en el host utilice la ip `10.0.2.2` en el arg --host