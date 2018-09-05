const ds = require("../data_store/ds_helper");

/***
 * action : {
 *  data_store : name
 *  sub_sections:[
 *      {
 *          action:add/update/del
 *          name:title of section with no spaces(Spaces are replaced by '_')
 *          value:{
 *                    title:Title with spaces
 *                    value: Some text or String that summarizes message
 *                }
 *          msg: Associated message
 *      },
 *       .
 *       .
 *       .
 *  ]
 * }
 * ***/

let action = {
  type: data_store,
  data_store: "CLOAS_ODS",
  sub_sections: [
    {
      action: "add",
      name: "CLOAS_ODS_ETL_STARTED",
      value: {
        title: "CLOAS ODS ETL STARTED",
        value: "ODS BATCH IS RUNNING"
      }
    },
    {
      action: "update",
      name: "CLOAS_ODS_ETL_STARTED",
      value: {
        title: "CLOAS ODS ETL STARTED",
        value: "ODS BATCH IS RUNNING"
      }
    },
    {
      action: "del",
      name: "CLOAS_ODS_ETL_FAILED",
      value: {
        title: "CLOAS ODS ETL FAILED",
        value: "ODS BATCH LOAD FAILED PEASE CHECK"
      }
    }
  ]
};

let message = {
  "@odata.etag": 'W/"CQAAABQAAAAEeUdoolc6QKuW3nHgimGgAAIhMQ=="',
  id:
    "AAMkAGRjMzE0N2UzLTFkZDctNGZkOS05MTNlLWExMjk2YzRmY2IyZgBGAAAAAAAy2Ld5TY7pTaF_ymk_eO1UBwB0VPG7QNy-Tbsi462Z9MGLAAAmiRE8AAB0VPG7QNy-Tbsi462Z9MGLAADlxOA8AAA=",
  receivedDateTime: "2018-08-27T16:30:41Z",
  subject:
    "Failure : ap0487alyn -PROD : CLOAS ODS : Cloas ODS Audit Update Report. Please check the Attached file.",
  bodyPreview:
    "Hi,\r\n\r\n\tSpooling Process completed successfully.\r\n\tPlease see the attached CLOAS_AUDIT_UPDATE_REPORT.\r\n\r\nThanks,\r\nETL Team\r\nEmail: GNWETLRPSUPP@genworth.com\r\nhttp://bugzilla-lyn.gefa.capital.ge.com/Bugzilla/etl",
  importance: "normal",
  isRead: false,
  body: {
    contentType: "text",
    content:
      "Hi,\r\n\r\n\tSpooling Process completed successfully.\r\n\tPlease see the attached CLOAS_AUDIT_UPDATE_REPORT.\r\n\r\nThanks,\r\nETL Team\r\nEmail: GNWETLRPSUPP@genworth.com\r\nhttp://bugzilla-lyn.gefa.capital.ge.com/Bugzilla/etl\r\n\r\n"
  },
  from: {
    emailAddress: {
      name: "CLOAS ODS Production",
      address: "clods_ap@ap0487alyn.genworth.net"
    }
  },
  ccRecipients: [],
  uniqueBody: {
    contentType: "html",
    content:
      '<html><body><div>\r\n<div><font size="2"><span style="font-size:11pt;">Hi,<br>\r\n\r\n<br>\r\n\r\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Spooling Process completed successfully.<br>\r\n\r\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Please see the attached CLOAS_AUDIT_UPDATE_REPORT.<br>\r\n\r\n<br>\r\n\r\nThanks,<br>\r\n\r\nETL Team<br>\r\n\r\nEmail: GNWETLRPSUPP@genworth.com<br>\r\n\r\n<a href="http://bugzilla-lyn.gefa.capital.ge.com/Bugzilla/etl">http://bugzilla-lyn.gefa.capital.ge.com/Bugzilla/etl</a><br>\r\n\r\n</span></font></div>\r\n</div>\r\n</body></html>'
  }
};

function logToDS(message, action) {
  action.sub_sections.forEach(sub_section => {
    if(sub_section.action == ('add') || sub_section.action == ('update') ){
      ds.updateDataStore(action.data_store,sub_section.name,sub_section.value);
    }else if (sub_section.action == ('del')) {
      ds.deleteFromDataStore(action.data_store,sub_section.name);
    }
    
  });
}

exports.logToDS = logToDS;
