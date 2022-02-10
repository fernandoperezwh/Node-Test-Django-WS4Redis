const request = require('request');
const jsdom = require('jsdom')
const dom = new jsdom.JSDOM("")
const jQuery = require('jquery')(dom.window)
const WebSocket = require('ws');
var argv = require('minimist')(process.argv.slice(2));

/**
 * Define el total de websockets mendiante argumento de entrada. Ex: node index.js --total=10
 */ 
const TOTAL = argv['total'] || 1;
/**
 * Identificacor del programa de ejecución
 */
const PREFIX =  argv['prefix'] || makePrefix();


//#region W4Redis 
/**
 * Contiene las instancias de WS4Redis creadas
 */
var wS4Redis_instances = {}

/**
 * options.uri - > The Websocket URI
 * options.connected -> Callback called after the websocket is connected.
 * options.connecting -> Callback called when the websocket is connecting.
 * options.disconnected -> Callback called after the websocket is disconnected.
 * options.receive_message -> Callback called when a message is received from the websocket.
 * options.heartbeat_msg -> String to identify the heartbeat message.
 * $ -> JQuery instance.
 */
function WS4Redis(options, $) {
	'use strict';
	var opts, ws, deferred, timer, attempts = 1, must_reconnect = true;
	var heartbeat_interval = null, missed_heartbeats = 0;

	if (this === undefined)
		return new WS4Redis(options, $);
	if (options.uri === undefined)
		throw new Error('No Websocket URI in options');
	if ($ === undefined)
		$ = jQuery;
	opts = $.extend({ heartbeat_msg: null }, options);
	connect(opts.uri);

	function connect(uri) {
		try {
			if (ws && (is_connecting() || is_connected())) {
				console.log(PREFIX, "- Websocket is connecting or already connected.");
				return;
			}
			
			if ($.type(opts.connecting) === 'function') {
				opts.connecting();
			}
			
			console.log(PREFIX, "- Connecting to " + uri + " ...");
			deferred = $.Deferred();
			ws = new WebSocket(uri);
			ws.onopen = on_open;
			ws.onmessage = on_message;
			ws.onerror = on_error;
			ws.onclose = on_close;
			timer = null;
		} catch (err) {
			try_to_reconnect();
			deferred.reject(new Error(err));
		}
	}

	function try_to_reconnect() {
		if (must_reconnect && !timer) {
			// try to reconnect
			console.log(PREFIX, '- Reconnecting...');
			var interval = generate_inteval(attempts);
			timer = setTimeout(function() {
				attempts++;
				connect(ws.url);
			}, interval);
		}
	}
	
	function send_heartbeat() {
		try {
			missed_heartbeats++;
			if (missed_heartbeats > 3)
				throw new Error("Too many missed heartbeats.");
			ws.send(opts.heartbeat_msg);
		} catch(e) {
			clearInterval(heartbeat_interval);
			heartbeat_interval = null;
			console.warn("Closing connection. Reason: " + e.message);
			if ( !is_closing() && !is_closed() ) {
				ws.close();
			}
		}
	}

	function on_open() {
		console.log(PREFIX, '- Connected!');
		// new connection, reset attemps counter
		attempts = 1;
		deferred.resolve();
		if (opts.heartbeat_msg && heartbeat_interval === null) {
			missed_heartbeats = 0;
			heartbeat_interval = setInterval(send_heartbeat, 5000);
		}
		if ($.type(opts.connected) === 'function') {
			opts.connected();
		}
	}

	function on_close(evt) {
		console.log(PREFIX, "- Connection closed!");
		if ($.type(opts.disconnected) === 'function') {
			opts.disconnected(evt);
		}
		try_to_reconnect();
	}

	function on_error(evt) {
		console.error("Websocket connection is broken!");
		deferred.reject(new Error(evt));
	}

	function on_message(evt) {
		if (opts.heartbeat_msg && evt.data === opts.heartbeat_msg) {
			// reset the counter for missed heartbeats
			missed_heartbeats = 0;
		} else if ($.type(opts.receive_message) === 'function') {
			return opts.receive_message(evt.data);
		}
	}

	// this code is borrowed from http://blog.johnryding.com/post/78544969349/
	//
	// Generate an interval that is randomly between 0 and 2^k - 1, where k is
	// the number of connection attmpts, with a maximum interval of 30 seconds,
	// so it starts at 0 - 1 seconds and maxes out at 0 - 30 seconds
	function generate_inteval(k) {
		var maxInterval = (Math.pow(2, k) - 1) * 1000;

		// If the generated interval is more than 30 seconds, truncate it down to 30 seconds.
		if (maxInterval > 30*1000) {
			maxInterval = 30*1000;
		}

		// generate the interval to a random number between 0 and the maxInterval determined from above
		return Math.random() * maxInterval;
	}

	this.send_message = function(message) {
		ws.send(message);
	};
	
	this.get_state = function() {
		return ws.readyState;	
	};
	
	function is_connecting() {
		return ws && ws.readyState === 0;	
	}
	
	function is_connected() {
		return ws && ws.readyState === 1;	
	}
	
	function is_closing() {
		return ws && ws.readyState === 2;	
	}

	function is_closed() {
		return ws && ws.readyState === 3;	
	}
	
	
	this.close = function () {
		clearInterval(heartbeat_interval);
		must_reconnect = false;
		if (!is_closing() || !is_closed()) {
			ws.close();
		}
	}
	
	this.is_connecting = is_connecting; 
	this.is_connected = is_connected;
	this.is_closing = is_closing;
	this.is_closed = is_closed;
}
//#endregion


//#region Custom WS4Redis events
function on_connecting() {
    console.log(PREFIX, '- connecting ', this.uri);
}

function on_connected() {
    console.log(PREFIX, '- connected ', this.uri);
}

function on_disconnected(evt) {
    console.log(PREFIX, '- disconnected ', this.uri);
}

function receiveMessage(data) {
    // Verificamos el status para cerrar la conexion
    let { task_id:facility, status } = JSON.parse(data);
    if (status === 'DONE') {
        wS4Redis_instances[facility].close();
    }
    console.log(PREFIX, `- There are ${getTotalOpenWs()} open ws`)
}
//#endregion




//#region Utilities
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


/**
 * Recorre las instancias de WS4Redis en 'wS4Redis_instances' y obtiene el total de conexiones abiertas
 * @returns 
 */
function getTotalOpenWs() {
    return Object.values(wS4Redis_instances)
        .filter(ws => ws.is_connected())
        .length;
}


/**
 * Genera una string aleatorio que sirve como prefix
 * 
 * @param {Number} length Tamaño de la cadena aleatoria
 * @returns 
 */
function makePrefix(length=5) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
//#endregion




/**
 * Crea una instancia de WS4Redis que abre una conexion de ws
 * 
 * @param {String} facility id del task 
 */
function task_adminolt_ajax(facility) {
    const WEBSOCKET_URI = 'ws://projectwebsocket.net/ws';
    /*si fuera necesario crear un receiveMessageAjax  y taks_error_ajax*/
    ws4redis = WS4Redis({
        uri: `${WEBSOCKET_URI}/${facility}?subscribe-broadcast`,
        connecting: on_connecting,
        connected: on_connected,
        receive_message: receiveMessage,
        disconnected: on_disconnected,
    });
    wS4Redis_instances[facility] = ws4redis;
}





async function main () {
    console.log(PREFIX, '- INFO: Obteniendo los la lista de facilities...')
    listFacilities = await getFacilities(TOTAL);
    listWebSockets = [];

    console.log(PREFIX, '- INFO: Creando las conexiones...', listFacilities)
    for (const facility of listFacilities) {
        try {

            task_adminolt_ajax(facility)
        } catch (err) {
            console.log(PREFIX, e- rr);
        }
    }
}


main()