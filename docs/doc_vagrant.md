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

## Nota:
Para probar el proyecto que corre en el host utilice la ip `10.0.2.2` en el arg --host
