const request = require("request");
const authHelper = require("../helpers/auth");
const sheets = require("./excel/sheets");
const utils = require("./utils");

// const excel_drive_item_id = 'F084686CF62DAC50!106';
const excel_drive_item_id = "01XW7VKJQ6IDEHA3BKCBBLH2RSYL74QING";

async function log_PI_to_excel(req) {
  console.log("excel logging started");

  let parms = {
    module: "excel_helper",
    auth: false,
    errors: [],
    debug: []
  };

  // const PIs = req.body.PIs;

  const accessToken = await authHelper.getAccessToken(req.cookies);
  if (accessToken) {
    parms.auth = true;
    //get all sheet names
    let sheet_list = await sheets.getAllSheets(
      accessToken,
      excel_drive_item_id
    );

    //get current month and year (Oct-18) and see if it exists else create
    let now = new Date();
    let month = now.toLocaleString("en-us", {
      month: "short"
    });
    let year = now.toLocaleString("en-us", {
      year: "2-digit"
    });
    let current_sheet_name = month + year;
    let current_table_name = current_sheet_name;
    let address = "A1:L2";

    // if (sheets in sheet_list.body) {
      if (sheet_list.body.sheets.indexOf(current_sheet_name) == -1) {
        //create new sheet
        console.log("making new sheet");

        let new_sheet = await sheets.createNewSheet(
          accessToken,
          excel_drive_item_id,
          current_sheet_name
        );
        if (new_sheet.body) {
          //create new table
          console.log("making new table");

          let new_table = await sheets.createNewTable(
            accessToken,
            excel_drive_item_id,
            current_sheet_name,
            current_table_name,
            address
          );
          if (new_table.body) {
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
            utils.error(new_sheet.errors, "create new table failed")
          );
          parms.debug.push({
            detail: `${JSON.stringify(new_sheet)}`
          });
          parms.errors.push(new_sheet);
        }
      }
    // } 
    // else {
    //     parms.errors.push(...sheet_list.errors);
    // }

    //write to that sheet
    console.log("write to new table");
  }
}



exports.log_PI_to_excel = log_PI_to_excel;
