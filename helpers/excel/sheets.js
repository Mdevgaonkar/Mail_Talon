const request = require("request");

const utils = require("../utils");

function getAllSheets(accessToken, excel_drive_item_id) {
  let parms = {
    module: "get_all_sheets",
    errors: [],
    debug: []
  };

  return new Promise(resolve => {
    request.get({
        uri: `https://graph.microsoft.com/v1.0/me/drive/items/${excel_drive_item_id}/workbook/worksheets`,
        proxy: process.env.proxyURL != 'null' ? process.env.proxyURL : null,
        headers: {
          Authorization: "Bearer " + accessToken
        }
      },
      (err, results, body) => {
        utils.handleResponse(err, results, body, parms, (parms, body) => {
          if (parms.body.indexOf("succeeded")) {
            parms.body = {};
            let sheets = body.value;
            if (sheets != undefined || sheets != null) {
              parms.body.sheets = sheets.map(sheet => {
                return sheet.name;
              });
            } else {
              parms.errors.push(utils.error(body, "could not fetch sheet list"));
            }

          }
          resolve(parms);
        });
      }
    );
  });
}

function createNewSheet(accessToken, excel_drive_item_id, sheetName) {
  let parms = {
    module: "create_new_sheet",
    errors: [],
    debug: []
  };

  return new Promise(resolve => {
    request.post({
        uri: `https://graph.microsoft.com/v1.0/me/drive/items/${excel_drive_item_id}/workbook/worksheets/add`,
        proxy: process.env.proxyURL != 'null' ? process.env.proxyURL : null,
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json"
        },
        json: {
          name: sheetName
        }
      },
      (err, results, body) => {
        utils.handleResponse(err, results, body, parms, (parms, body) => {
          if (parms.body.indexOf("succeeded")) {
            if (sheetName === body.name) {
              parms.body = true;
            }
          } else {
            parms.body = false;
            parms.errors.push(utils.error(body, "could not create new sheet"));
          }
          resolve(parms);
        });
      }
    );
  });
}

function createNewTable(
  accessToken,
  excel_drive_item_id,
  sheetName,
  tableName,
  address
) {
  let parms = {
    module: "create_new_table",
    errors: [],
    debug: []
  };

  return new Promise(resolve => {
    request.post({
        uri: `https://graph.microsoft.com/v1.0/me/drive/items/${excel_drive_item_id}/workbook/tables/add`,
        proxy: process.env.proxyURL != 'null' ? process.env.proxyURL : null,
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json"
        },
        json: {
          address: `${sheetName}!${address}`,
          hasHeaders: true
        }
      },
      (err, results, body) => {
        utils.handleResponse(err, results, body, parms, async (parms, body) => {
          if (parms.body.indexOf("succeeded")) {

            let rename_table = await renameTable(accessToken, excel_drive_item_id, body.name, tableName);
            if (rename_table.body) {
              parms.body = true;
            } else {
              parms.body = false;
              parms.errors.push(utils.error(body, "could not rename new table"));
            }
          } else {
            parms.body = false;
            parms.errors.push(utils.error(body, "could not create new table"));
          }
          resolve(parms);
        });
      }
    );
  });
}

function renameTable(
  accessToken,
  excel_drive_item_id,
  oldTableIdName,
  newTableName
) {
  let parms = {
    module: "rename_table",
    errors: [],
    debug: []
  };

  return new Promise(resolve => {
    request.patch({
        uri: `https://graph.microsoft.com/v1.0/me/drive/items/${excel_drive_item_id}/workbook/tables/${oldTableIdName}`,
        proxy: process.env.proxyURL != 'null' ? process.env.proxyURL : null,
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json"
        },
        json: {
          name: `Table_${newTableName}`
        }
      },
      (err, results, body) => {
        utils.handleResponse(err, results, body, parms, (parms, body) => {
          if (parms.body.indexOf("succeeded")) {
            parms.body = true;
          } else {
            parms.body = false;
            parms.errors.push(utils.error(body, "could not rename table"));
          }
          resolve(parms);
        });
      }
    );
  });
}

function createRows(accessToken, excel_drive_item_id, table_name, rowDataArray) {
  let parms = {
    module: "create_new_sheet",
    errors: [],
    debug: []
  };

  return new Promise(resolve => {
    request.post({
        uri: `https://graph.microsoft.com/v1.0/me/drive/items/${excel_drive_item_id}/workbook/tables/Table_${table_name}/rows/add`,
        proxy: process.env.proxyURL != 'null' ? process.env.proxyURL : null,
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json"
        },
        json: {
          values: rowDataArray
        }
      },
      (err, results, body) => {
        utils.handleResponse(err, results, body, parms, (parms, body) => {
          if (parms.body.indexOf("succeeded")) {
            console.log(body.values);
            console.log(rowDataArray);

            if (body.values[0] === rowDataArray[0]) {
              parms.body = true;
            }
          } else {
            parms.body = false;
            parms.errors.push(utils.error(body, "could not create new rows on sheet"));
          }
          resolve(parms);
        });
      }
    );
  });
}

exports.getAllSheets = getAllSheets;
exports.createNewSheet = createNewSheet;
exports.createNewTable = createNewTable;
exports.renameTable = renameTable;
exports.createRows = createRows;