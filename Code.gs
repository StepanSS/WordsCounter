function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('Custom Menu')
      .addItem('Keywords Analysis', 'showUserForm')
      .addToUi();
}

//============================= Parse, Analyze Doc and Print res to Shhet1 =====================//
function analyseDocSh1(data){
  if(!data){var data = {docUrl: "https://docs.google.com/document/d/1SN-nFmyeqVWeJRjJ_-X4V_vuHj206_mLTNFGU4YogW0/edit#"}}; // for debuging
  var spreadsheet = getSpreadsheet();
  var sheet1 = spreadsheet.getSheets()[0];          //getSheet("Res1");
  var sheet2 = spreadsheet.getSheets()[1];          //getSheet("Res2");
  var sheetParam = spreadsheet.getSheets()[2];//getSheet("Parameters");
//  Logger.log(data);
  try{
    var doc = getDoc(data.docUrl);
    scapeGDocSh1(sheet1, sheet2, sheetParam, doc);
    successMsg();
    return 1;
  }
  catch(e){
    Logger.log("Error: "+e);
    Browser.msgBox("Error: "+e);
    return 0;
  }
} // END analyseDocSh1

//============================= Parse, Analyze Doc and Print res to Shhet2 =====================//
function analyseDocSh2(data){
  var spreadsheet = getSpreadsheet();
  var sheet1 = spreadsheet.getSheets()[0];          //getSheet("Res1");
  var sheet2 = spreadsheet.getSheets()[1];          //getSheet("Res2");
  var sheetParam = spreadsheet.getSheets()[2];//getSheet("Parameters");

  try{
    var doc = getDoc(data.docUrl);
    scapeGDocSh2(sheet1, sheet2, sheetParam, doc);
    successMsg();
    return 1;
  }
  catch(e){
//    Logger.log("Error: "+e);
    Browser.msgBox("Error: "+e);
    return 0;
  }
} // END analyseDocSh1

//============================= Parse, Analyze WEB and Print res to Sheet1 =====================//
function analyseWebSh1(data){
  if(!data){var data = {webUrl: "https://www.moderndrummer.com/2011/10/what-you-need-to-know-about-drumheads/"}}; // for debuging
  var spreadsheet = getSpreadsheet();
  var sheet1 = spreadsheet.getSheets()[0];          //getSheet("Res1");
  var sheet2 = spreadsheet.getSheets()[1];          //getSheet("Res2");
  var sheetParam = spreadsheet.getSheets()[2];      //getSheet("Parameters");
//  url = 'https://docs.google.com/document/d/19Sw5lUNse_GlpSUJlgNe8LGe-OgQAyOnqkV_m2mxaPg/edit';
//  var testDoc = DocumentApp.openByUrl(url);           // test sheet
  
  var webSiteUrl = data.webUrl;                      // return String
  try{
    scrapeWebsiteSh1(sheet1, sheet2, sheetParam, webSiteUrl);
//    successMsg();
    return 1;
  }
  catch(e){
    Logger.log("Error: "+e);
//    Browser.msgBox("Error: "+e);
    return 0;
  }
}
//============================= Parse, Analyze WEB and Print res to Sheet2 =====================//
function analyseWebSh2(data){
  if(!data){var data = {webUrl: "https://www.moderndrummer.com/2011/10/what-you-need-to-know-about-drumheads/"}}; // for debuging
  var spreadsheet = getSpreadsheet();
  var sheet1 = spreadsheet.getSheets()[0];          //getSheet("Res1");
  var sheet2 = spreadsheet.getSheets()[1];          //getSheet("Res2");
  var sheetParam = spreadsheet.getSheets()[2];      //getSheet("Parameters");
  
  var webSiteUrl = data.webUrl;                     // return String
  try{
    scrapeWebsiteSh2(sheet1, sheet2, sheetParam, webSiteUrl);
//    successMsg();
    return 1;
  }
  catch(e){
    Logger.log("Error: "+e);
//    Browser.msgBox("Error: "+e);
    return 0;
  }
}

// ======
function getSpreadsheet(){
//  var sheetName = sheetName;
//  var url = "https://docs.google.com/spreadsheets/d/1pOu4sVneX6JTGX9ncoDwCyhFBI6cArGpaIWsNSm7vng/edit#gid=70729781";
  var ss = SpreadsheetApp.getActive();//SpreadsheetApp.openByUrl(url);
  return ss;  
}
function getDocUrl(){
  var ss = getSpreadsheet();
  var sheetParam = ss.getSheetByName("Parameters");
  var url = sheetParam.getRange(1, 4, 1).getValue(); // get url as string
//  Logger.log(url);
  return url;
}
function getWebUrl(){
  var ss = getSpreadsheet();
  var sheetParam = ss.getSheetByName("Parameters");
  var urls = sheetParam.getRange(1, 6, sheetParam.getLastRow()-1).getValues(); // get urls array
  var filtered = [], i=0;
  while( i< urls.length && urls[i] != "" ){
    filtered.push(urls[i]);
    i++;
  }
//  Logger.log(keyWordsList);
//  Logger.log(filtered);
  return filtered;                               // Return 2d array[][]
}

// ======
function getDoc(url) {
//  url = getDocUrl()//'https://docs.google.com/document/d/1SN-nFmyeqVWeJRjJ_-X4V_vuHj206_mLTNFGU4YogW0/edit#';
  var doc = DocumentApp.openByUrl(url);
  return doc;
}

// ======= Create User Form/ Sidebar ================================//
function showUserForm() {
  var template = HtmlService.createTemplateFromFile("userform");
  var html = template.evaluate();
  SpreadsheetApp.getUi().showSidebar(html);
}

function errorMsg(){
  Browser.msgBox("Url Requered"); 
}
function successMsg(){
  Browser.msgBox("Success"); 
}
//// Show Alert
//SpreadsheetApp.getUi().alert('First Analysis Done');
//SpreadsheetApp.getUi().alert('Second Analysis Done');

