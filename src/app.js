const request = require('request');
const WebSocket = require('ws');

function test(total_ws=1) {
    for (let i = 0; i < total_ws; i++) {        
        // https://www.npmjs.com/package/ws
        const ws = new WebSocket('wss://websocket-echo.com/');

        ws.on('open', function open() {
        console.log('connected');
        ws.send(Date.now());
        });

        ws.on('close', function close() {
        console.log('disconnected');
        });

        ws.on('message', function message(data) {
            ws.send(Date.now());
            console.log(`Round-trip time: ${Date.now() - data} ms`);
            setTimeout(() => {
                ws.close();
            }, 500);
        });
    }
}


/**
 * Obtiene una lista de facilities para establecer conexión por medio de ws
 * 
 * @param {Number} total_ws Total de ws a llamar
 * @returns 
 */
async function getFacilities(total_ws=1) {
    const endpoint = `http://projectwebsocket.net/r/${total_ws}/`;
    
    return new Promise((resolve, reject) => {
        request(endpoint, async function (error, response, body) {
            resolve(JSON.parse(body).list_facility);
        });
    })
}


function heartbeat() {
    clearTimeout(this.pingTimeout);
  
    // Use `WebSocket#terminate()`, which immediately destroys the connection,
    // instead of `WebSocket#close()`, which waits for the close timer.
    // Delay should be equal to the interval at which your server
    // sends out pings plus a conservative assumption of the latency.
    this.pingTimeout = setTimeout(() => {
        this.terminate();
    }, 30000 + 1000);
}




async function main (numWebSockets, showErrors=false) {
    console.log('INFO: Obteniendo los la lista de facilities...')
    listFacilities = await getFacilities(numWebSockets);
    listWebSockets = [];

    console.log('INFO: Creando las conexiones...', listFacilities)
    for (const facility of listFacilities) {
        try {
            const ws = new WebSocket(`ws://projectwebsocket.net/ws/${facility}?subscribe-broadcast`);

            ws.onerror = (err) => {
                if (showErrors) console.log('Error: ', err);
            };

            ws.onopen = () => {
                heartbeat();
                console.log(`LOG: ws ${facility} is open`);
            };

            ws.onmessage = (wsData) => {
                const data = JSON.parse(wsData.data);
                console.log(`LOG: ws ${facility} response status ${data.status}`);
                if (data.status === 'DONE') ws.close();
            };
            ws.onclose = () => {
                console.log(`LOG: ws ${facility} disconnected`);
            };

            ws.on('ping', () => heartbeat());
            ws.on('close', function clear() {
                clearTimeout(this.pingTimeout);
            });
            
            listWebSockets.push(ws);




        } catch (err) {
            console.log(err);
        }
    }


    setTimeout(() => {
        const total = listFacilities.filter(ws => ws.readyState === WebSocket.OPEN).length;
        console.log(`There are #${total} open connections.`)
    }, 10);
}


const total_Ws = 2
main(total_Ws);
// test(total_Ws);