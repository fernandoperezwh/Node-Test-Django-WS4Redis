const argv = require('minimist')(process.argv.slice(2));

// local modules
const { WS4Redis } = require('./classes/WS4Redis');
const { getListTaskId } = require('./utils/getListTaskId');



//#region command args
/**
 * Total of websockets to open 
 */ 
const TOTAL = argv['total'] || 1;
/**
 * Server hosts
 */
const HOST = argv['host'] || 'localhost';
//#endregion




/**
 * WS4Redis instances
 */
var wS4Redis_instances = {}


//#region Custom WS4Redis events
function on_connecting() {
    console.log('connecting ', this.uri);
}

function on_connected() {
    console.log('connected ', this.uri);
}

function on_disconnected(evt) {
    console.log('disconnected ', this.uri);
}

function receiveMessage(data) {
	// In each server socket message we ask for status DONE to close ws connection
    let { task_id, status } = JSON.parse(data);
    console.log(`ws message: ${task_id} status ${status}`);
    if (status === 'DONE') {
        wS4Redis_instances[task_id].close();
    }
}
//#endregion




/**
 * Open a ws connection via WS4Redis class
 * 
 * @param {String} taskId task id
 */
function task_ajax(taskId) {
    const WEBSOCKET_URI = `ws://${HOST}/ws`;
    ws4redis = WS4Redis({
        uri: `${WEBSOCKET_URI}/${taskId}?subscribe-broadcast`,
        connecting: on_connecting,
        connected: on_connected,
        receive_message: receiveMessage,
        disconnected: on_disconnected,
    });
    wS4Redis_instances[taskId] = ws4redis;
}





async function main () {
    console.log('INFO: Please wait, getting list of task_id...')
    listTaskId = await getListTaskId(HOST, TOTAL);
    listWebSockets = [];

    console.log('INFO: Opening websockets connections...', listTaskId)
    for (const taskId of listTaskId) {
        try {

            task_ajax(taskId);
        } catch (err) {
            console.log('Ups! Something is wrong... ', err);
        }
    }
}


main();