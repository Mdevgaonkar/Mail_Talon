const request = require("request");

const utils = require("../utils");

function getAllSheets(accessToken, excel_drive_item_id) {
  let parms = {
    module: "get_all_sheets",
    errors: [],
    debug: []
  };

  return new Promise(resolve => {
    request.get(
      {
        uri: `https://graph.microsoft.com/v1.0/me/drive/items/${excel_drive_item_id}/workbook/worksheets`,
        proxy: process.env.proxyURL != "null" ? process.env.proxyURL : null,
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
              parms.errors.push(
                utils.error(body, "could not fetch sheet list")
              );
            }
          }
          resolve(parms);
        });
      }
    );
  });
}

async function getAllSheetsFromWorkbook(accessToken, excel_drive_item_path) {
  let parms = {
    module: "get_all_sheets",
    errors: [],
    debug: []
  };
  /**************Block that gets item Id from the path***********/
  let workbook = await getWorkbookIDWithPath(
    accessToken,
    excel_drive_item_path
  );
  if ("body" in workbook && "workbook_ID" in workbook.body) {
    var excel_drive_item_id = workbook.body.workbook_ID;
  } else {
    parms.errors.push(utils.error(body, "could not fetch workbook ID"));
    return new Promise(resolve => {
      resolve(parms);
    });
  }
  /**************Block that gets item Id from the path***********/

  return new Promise(resolve => {
    request.get(
      {
        uri: `https://graph.microsoft.com/v1.0/me/drive/items/${excel_drive_item_id}/workbook/worksheets`,
        proxy: process.env.proxyURL != "null" ? process.env.proxyURL : null,
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
              parms.errors.push(
                utils.error(body, "could not fetch sheet list")
              );
            }
          }
          resolve(parms);
        });
      }
    );
  });
}

async function getWorkbookIDWithPath(accessToken, excel_drive_item_path) {
  let parms = {
    module: "get_Workbook_ID_With_Path",
    errors: [],
    debug: []
  };

  return new Promise(resolve => {
    request.get(
      {
        uri: encodeURI(
          `https://graph.microsoft.com/v1.0/me/drive/root:${excel_drive_item_path}`
        ),
        proxy: process.env.proxyURL != "null" ? process.env.proxyURL : null,
        headers: {
          Authorization: "Bearer " + accessToken
        }
      },
      (err, results, body) => {
        utils.handleResponse(err, results, body, parms, (parms, body) => {
          if (parms.body.indexOf("succeeded")) {
            parms.body = {};
            if ("id" in body) {
              let workbook_ID = body.id;
              parms.body.workbook_ID = workbook_ID;
            } else {
              parms.errors.push(utils.error(body, "could not fetch sheet ID"));
            }
          }
          resolve(parms);
        });
      }
    );
  });
}

async function createNewSheet(accessToken, excel_drive_item_path, sheetName) {
  let parms = {
    module: "create_new_sheet",
    errors: [],
    debug: []
  };

  /**************Block that gets item Id from the path***********/
  let workbook = await getWorkbookIDWithPath(
    accessToken,
    excel_drive_item_path
  );
  if ("body" in workbook && "workbook_ID" in workbook.body) {
    var excel_drive_item_id = workbook.body.workbook_ID;
  } else {
    parms.errors.push(utils.error(body, "could not fetch workbook ID"));
    return new Promise(resolve => {
      resolve(parms);
    });
  }
  /**************Block that gets item Id from the path***********/

  return new Promise(resolve => {
    request.post(
      {
        uri: `https://graph.microsoft.com/v1.0/me/drive/items/${excel_drive_item_id}/workbook/worksheets/add`,
        proxy: process.env.proxyURL != "null" ? process.env.proxyURL : null,
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

async function createNewTable(
  accessToken,
  excel_drive_item_path,
  sheetName,
  tableName,
  address
) {
  let parms = {
    module: "create_new_table",
    errors: [],
    debug: []
  };

  /**************Block that gets item Id from the path***********/
  let workbook = await getWorkbookIDWithPath(
    accessToken,
    excel_drive_item_path
  );
  if ("body" in workbook && "workbook_ID" in workbook.body) {
    var excel_drive_item_id = workbook.body.workbook_ID;
  } else {
    parms.errors.push(utils.error(body, "could not fetch workbook ID"));
    return new Promise(resolve => {
      resolve(parms);
    });
  }
  /**************Block that gets item Id from the path***********/

  return new Promise(resolve => {
    request.post(
      {
        uri: `https://graph.microsoft.com/v1.0/me/drive/items/${excel_drive_item_id}/workbook/tables/add`,
        proxy: process.env.proxyURL != "null" ? process.env.proxyURL : null,
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
            let rename_table = await renameTable(
              accessToken,
              excel_drive_item_id,
              body.name,
              tableName
            );
            if (rename_table.body) {
              parms.body = true;
            } else {
              parms.body = false;
              parms.errors.push(
                utils.error(body, "could not rename new table")
              );
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

async function renameTable(
  accessToken,
  excel_drive_item_path,
  oldTableIdName,
  newTableName
) {
  let parms = {
    module: "rename_table",
    errors: [],
    debug: []
  };

  /**************Block that gets item Id from the path***********/
  let workbook = await getWorkbookIDWithPath(
    accessToken,
    excel_drive_item_path
  );
  if ("body" in workbook && "workbook_ID" in workbook.body) {
    var excel_drive_item_id = workbook.body.workbook_ID;
  } else {
    parms.errors.push(utils.error(body, "could not fetch workbook ID"));
    return new Promise(resolve => {
      resolve(parms);
    });
  }
  /**************Block that gets item Id from the path***********/

  return new Promise(resolve => {
    request.patch(
      {
        uri: `https://graph.microsoft.com/v1.0/me/drive/items/${excel_drive_item_id}/workbook/tables/${oldTableIdName}`,
        proxy: process.env.proxyURL != "null" ? process.env.proxyURL : null,
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

async function createRows(
  accessToken,
  excel_drive_item_path,
  table_name,
  rowDataArray
) {
  let parms = {
    module: "create_new_sheet",
    errors: [],
    debug: []
  };
  /**************Block that gets item Id from the path***********/
  let workbook = await getWorkbookIDWithPath(
    accessToken,
    excel_drive_item_path
  );
  if ("body" in workbook && "workbook_ID" in workbook.body) {
    var excel_drive_item_id = workbook.body.workbook_ID;
  } else {
    parms.errors.push(utils.error(body, "could not fetch workbook ID"));
    return new Promise(resolve => {
      resolve(parms);
    });
  }
  /**************Block that gets item Id from the path***********/
  return new Promise(resolve => {
    request.post(
      {
        uri: `https://graph.microsoft.com/v1.0/me/drive/items/${excel_drive_item_id}/workbook/tables/Table_${table_name}/rows/add`,
        proxy: process.env.proxyURL != "null" ? process.env.proxyURL : null,
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
            // console.log(body.values);
            // console.log(rowDataArray);
            if (
              "values" in body &&
              typeof body.values === "object" &&
              body.values instanceof Array
            ) {
              if (body.values[0][0] === rowDataArray[0][0]) {
                parms.body = true;
              }
            } else {
              parms.body = false;
              console.log("could not create new rows on sheet");
              parms.errors.push(
                utils.error(body, "could not create new rows on sheet")
              );
            }
          } else {
            parms.body = false;
            console.log("could not create new rows on sheet");
            parms.errors.push(
              utils.error(body, "could not create new rows on sheet")
            );
          }
          resolve(parms);
        });
      }
    );
  });
}


function columnsToAddress(columnNumber){

  if(columnNumber>0 && columnNumber<(26*26*26)){
    var dividend = columnNumber
    var columnName = ''
    var modulo

    while (dividend > 0)
    {
        modulo = (dividend - 1) % 26
        columnName = String.fromCharCode(65 + modulo) + columnName
        dividend = Math.floor((dividend - modulo) / 26)
    } 

    return 'A1:'+columnName+'2';
  }else{
    return 'A1:A1';
  }
  
}

exports.getAllSheets = getAllSheets;
exports.getAllSheetsFromWorkbook = getAllSheetsFromWorkbook;
exports.createNewSheet = createNewSheet;
exports.createNewTable = createNewTable;
exports.renameTable = renameTable;
exports.createRows = createRows;
exports.columnsToAddress = columnsToAddress;
