const request = require("request");
const authHelper = require("../auth");
const sheets = require("../excel/sheets");
const utils = require("../utils");


async function log_to_excel(req, rows, action) {
  console.log("excel logging started");

  let parms = {
    module: "excel_helper",
    auth: false,
    errors: [],
    debug: []
  };

  var actionProps = getActionProps(action);
  excel_drive_item_path=actionProps.excel_drive_item_path;
  current_sheet_name=actionProps.current_sheet_name;
  current_table_name=actionProps.current_table_name;
  num_of_cols=actionProps.num_of_cols;


  const accessToken = await authHelper.getAccessToken(req.cookies);
  if (accessToken) {
    parms.auth = true;
    //get all sheet names
    let sheet_list = await sheets.getAllSheetsFromWorkbook(
      accessToken,
      excel_drive_item_path
    );


    let address = sheets.columnsToAddress(num_of_cols);


    if (sheet_list.body.sheets.indexOf(current_sheet_name) == -1) {
      //create new sheet
      console.log("making new sheet");

      let new_sheet = await sheets.createNewSheet(
        accessToken,
        excel_drive_item_path,
        current_sheet_name
      );
      if ('body' in new_sheet) {
        //create new table
        console.log("making new table");

        let new_table = await sheets.createNewTable(
          accessToken,
          excel_drive_item_path,
          current_sheet_name,
          current_table_name,
          address
        );
        if ('body' in  new_table) {
          console.log("new table created");
        } else {
          console.log(new_table);
          parms.errors.push(
            utils.error(new_table.errors, "create new table failed")
          );
          parms.debug.push({
            detail: `${JSON.stringify(new_table)}`
          });
        }
      } else {
        console.error(new_sheet);
        parms.errors.push(
          utils.error(new_sheet.errors, "create new Sheet failed")
        );
        parms.debug.push({
          detail: `${JSON.stringify(new_sheet)}`
        });
        parms.errors.push(new_sheet);
      }
    }

    //write to that sheet
    console.log("writing to table");
    return await sheets.createRows(
      accessToken,
      excel_drive_item_path,
      current_table_name,
      rows
    );
  }
}


function getActionProps (action){
  // action = {
  //   "type": "excel_add_row",
  //   "excel_path": "/PI_online.xlsx",
  //   "sheet_name": {
  //     "eval": true,
  //     "name": "new Date().toLocaleString('en-us', {month: 'short'})+'_'+new Date().toLocaleString('en-us', {year: '2-digit'})"
  //   },
  //   "table_name": {
  //     "eval": true,
  //     "name": "new Date().toLocaleString('en-us', {month: 'short'})+'_'+new Date().toLocaleString('en-us', {year: '2-digit'})"
  //   },
  //   "num_of_cols":12
  // }

  
  current_sheet_name = action.sheet_name.eval? eval(action.sheet_name.name) : action.sheet_name.name;
  current_table_name = action.table_name.eval? eval(action.table_name.name) : action.table_name.name;

  return {
    excel_drive_item_path:action.excel_path,
    current_sheet_name:current_sheet_name,
    current_table_name:current_table_name,
    num_of_cols:action.num_of_cols
  }

}

exports.log_PI_to_excel = log_PI_to_excel;
