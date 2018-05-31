const body_compare = require("../comparers/body_compare.js");

function getPIRow(mail) {
  const mail_body = mail.body.content;
  const clean_body = body_compare.cleanBody(mail_body, true);
  const {
    issue_subject,
    issue_body
  } = getIssue(clean_body);
  const {
    issue_recDate,
    issue_respDate
  } = getIssueRecvRespDate(clean_body);
  const issue_resolvedDate = getIssueResolvedDate(mail.receivedDateTime);

  const issue = {
    issue_resolver: mail.from.emailAddress.name,
    issue_aplication: "",
    issue_blank_col1: "",
    issue_blank_col2: "",
    issue_subject: issue_subject,
    issue_dateTime: issue_recDate,
    issue_body: issue_body,
    issue_rootCause: "",
    issue_resolution: "",
    issue_recDate: issue_recDate,
    issue_respDate: issue_respDate == null ? issue_resolvedDate : issue_respDate,
    issue_resolvedDate: issue_resolvedDate
  };
  // console.log(issue);

  return issue;
}

function getIssue(clean_body_string) {
  const splitted_string = clean_body_string.split("Subject:");
  const subjectWise_split = splitted_string[splitted_string.length - 1].split(
    "\n"
  );
  const issueSubject = subjectWise_split[0].replace(/[\r]/g, "");
  const issue_body_array = [...subjectWise_split.slice(1)];
  const issue_body = issue_body_array.join(" ").replace(/[\r]/g, "");
  return {
    issue_subject: issueSubject,
    issue_body: issue_body
  };
}

function getIssueRecvRespDate(clean_body_string) {
  const splitted_string = clean_body_string.split("Sent:");

  // received date
  const issue_receivedDateTime = splitted_string[
    splitted_string.length - 1
  ].split("\n")[0];
  const PI_recDtTime = new Date(issue_receivedDateTime);
  const formated_PI_recDtTime = formatDate(PI_recDtTime);

  // Response date 
  if (splitted_string.length > 2) {
    var issue_responseDateTime = splitted_string[
      splitted_string.length - 2
    ].split("\n")[0];
    var PI_respDtTime = new Date(issue_responseDateTime);
    var formated_PI_respDtTime = formatDate(PI_respDtTime);
  } else {
    issue_responseDateTime = null;
    PI_respDtTime = null;
    formated_PI_respDtTime = null;
  }


  return {
    issue_recDate: formated_PI_recDtTime,
    issue_respDate: formated_PI_respDtTime
  };
}

function getIssueResolvedDate(receivedDateTime) {
  const resolvedDate = new Date(receivedDateTime);
  const formated_resolvedDate = formatDate(resolvedDate);
  return formated_resolvedDate;
}

function formatDate(date_string) {
  const DtTime = new Date(date_string);
  let formated_DtTime =
    DtTime.getMonth() + "/" + DtTime.getDate() + "/" + DtTime.getFullYear();
  formated_DtTime =
    formated_DtTime +
    " " +
    DtTime.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true
    });
  return formated_DtTime;
}


exports.getPIRow = getPIRow;