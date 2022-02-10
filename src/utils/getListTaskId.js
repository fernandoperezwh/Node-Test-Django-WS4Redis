const request = require('request');

/**
 * Send a request to server to get the list of task id.
 * After with this list, we are going to open ws connection.
 * 
 * @param {Number} total_ws Number of ws to open
 * @returns 
 */
async function getListTaskId(host, total_ws=1) {
    const endpoint = `http://${host}/r/${total_ws}/`;
    
    return new Promise((resolve, reject) => {
        request(endpoint, async function (error, response, body) {
            resolve(JSON.parse(body).list_facility);
        });
    })
}

module.exports = {
    getListTaskId,
}