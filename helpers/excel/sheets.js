const request = require('request');

const utils = require('../utils');

function getAllSheets(accessToken, excel_drive_item_id) {
    let parms = {
        module: 'get_all_sheets',
        errors: [],
        debug: []
    };

    return new Promise(resolve => {
        request.get({
                uri: `https://graph.microsoft.com/v1.0/me/drive/items/${excel_drive_item_id}/workbook/worksheets`,
                // proxy: process.env.proxyURL, 
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            },
            (err, results, body) => {
                utils.handleResponse(err, results, body, parms, (parms, body) => {
                    if (parms.body.indexOf('succeeded')) {
                        parms.body = {};
                        let sheets = body.value;
                        parms.body.sheets = sheets.map(sheet => {
                            return sheet.name;
                        })
                    }
                    resolve(parms);

                });
            }
        );
    });

}

function createNewSheet(accessToken, excel_drive_item_id, sheetName) {
    let parms = {
        module: 'create_new_sheet',
        errors: [],
        debug: []
    };

    return new Promise(resolve => {
        request.post({
                uri: `https://graph.microsoft.com/v1.0/me/drive/items/${excel_drive_item_id}/workbook/worksheets/add`,
                // proxy: process.env.proxyURL, 
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                body: {
                    'name': sheetName
                }
            },
            (err, results, body) => {
                utils.handleResponse(err, results, body, parms, (parms, body) => {
                    if (parms.body.indexOf('succeeded')) {
                        if (sheetName === body.name) {
                            parms.body = true;
                        }
                    } else {
                        parms.body = false;
                    }
                    resolve(parms);

                });
            }
        );
    });
}

exports.getAllSheets = getAllSheets;
exports.createNewSheet = createNewSheet;