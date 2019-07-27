function scrapeWebsiteSh1(sheet1, sheet2, sheetParam, webSiteUrl) {
  // Fetch Url Section
  var fetchUrl = new FetchUrl(webSiteUrl);
  var webData = fetchUrl.getWebData();                                          // return sorted paragraphs by h1,h2,h3,h4 and NormalText
  //==============================================================
//  var data = fetchUrl.string;
//  var body = doc.getBody();
//  var text = body.editAsText();
  // Insert text at the beginning of the document.
//  text.insertText(0, data);
//  Logger.log(data);
//  Logger.log(webData);
  //=============================================================== Test
  // Sheet1 Section  
  var totalWordsArray = getWebTotalWords(webData, sheetParam);                  // return array of all words minus excuded words
  var totalWords = totalWordsArray.length;                                      // return number of words
  var keyWordsList = getKeyWords(sheet1);                                       // return keywords list from A2:
  var keyWordsMatchesFound = getAllMatches(webData, keyWordsList);              // return array with numbers of matches
  var summForEachKeyword = getSummForEachKeyword(keyWordsMatchesFound);         // return array
  var keywordDistribution  = countDistribution(totalWords, summForEachKeyword); // %Dist = Percent Distribution (Total / Word Count) Return array 2d
  var resultArray = getResultArray(keyWordsMatchesFound, summForEachKeyword, keywordDistribution);
  
  printWebResult(sheet1, keyWordsList, resultArray, totalWords, webSiteUrl);
}

// ============================
function scrapeWebsiteSh2(sheet1, sheet2, sheetParam, webSiteUrl) {
  
  // Fetch Url  - Section
  var fetchUrl = new FetchUrl(webSiteUrl);
  var webData = fetchUrl.getWebData();                                          // return sorted paragraphs by h1,h2,h3,h4 and NormalText
  
  // Sheet1 -  Section  
  var totalWordsArray = getWebTotalWords(webData, sheetParam);                  // return array of all words 
  var totalWords = totalWordsArray.length;                                      // return number of words
  var totalCorrected = removeExcludedWords(totalWordsArray, sheetParam);        // return array of all words minus excuded words
  
  //Sheet2  - Section
  var textAnalyzer = new TextAnalyzer(sheet2, totalCorrected);
  textAnalyzer.keywordAnalysis(1);
//  textAnalyzer.keywordAnalysis(2);
//  textAnalyzer.keywordAnalysis(3);
//  textAnalyzer.keywordAnalysis(4);
}

// ====== Get URL
function getUrl(sheetParam){
  var url = sheetParam.getRange(2, 4, 1, 1).getValue();
  return url;
}
// ====== Print Web Result Below table
function printWebResult(sheet, keyWordsList, resultArray, totalWords, url){
  var totalWords = [["Total Words", totalWords]];
  var webUrl = [["Web Url", url]];
  var startRow = sheet.getLastRow()+2;
  var colNum = resultArray[0].length;
  var rowNum = resultArray.length;
  var rangeKeywords = sheet.getRange(startRow, 1, rowNum, 1);
  var range = sheet.getRange(startRow, 2, rowNum, colNum);
  var rangeTotalWords = sheet.getRange(startRow, 11, 1, 2);
  var rangeUrl = sheet.getRange(startRow+1, 11, 1, 2);
  rangeKeywords.clearContent();
  range.clearContent();
  rangeTotalWords.clearContent();
  rangeUrl.clearContent();
  rangeKeywords.setValues(keyWordsList);
  range.setValues(resultArray);
  rangeTotalWords.setValues(totalWords);
  rangeUrl.setValues(webUrl);
}

// ====== Collect all data in one array ========================================//
function getResultArray(keyWordsMatchesFound, summForEachKeyword, keywordDistribution){
//  Logger.log(keyWordsMatchesFound);
  for(var i = 0; i<keyWordsMatchesFound.length; i++ ){
    var sum = summForEachKeyword[i]
    keyWordsMatchesFound[i].push(summForEachKeyword[i][0]);
    keyWordsMatchesFound[i].push(keywordDistribution[i][0]);
  }
//  Logger.log(newArr);
  return keyWordsMatchesFound;
}

// ====== Get Total Web Words  =============================//
function getWebTotalWords(webData, sheetParam){
  // RegEx to remove excluded wordds
//  var excludedWords = sheetParam.getRange(2, 1, sheetParam.getLastRow()-1).getValues(); // get words list
//  excludedWords = excludedWords.join("|");
//  excludedWords = "(\\b(?:"+excludedWords+")\\b)";  // build RegExp like (\b(?:are|a|of|on|and)\b)
//  var regExp = new RegExp(excludedWords, 'gim');
//  var regExpLinks = new RegExp("https?:\/\/.*[\r\n]*", 'gim');
  
  // CREATE STRING FROM OBJ webData 
  var bodyText = "";
  //Iterate Obj webData 
  for(var keyName in webData){
    var string = webData[keyName].join(" ")
    bodyText = bodyText +" "+ string;
  }
//  bodyText = bodyText.replace(regExpLinks, "");   // remove links
//  bodyText = bodyText.replace(regExp, "");        // remove excluded words
//  Logger.log(bodyText);
  var matches = bodyText.match(/(?!-)([\w\d\&\’\'-]+)/gi); // get all words from body text. Return Array
//  Logger.log(matches.length);
//  Logger.log(matches);
  return matches ? matches : 0;
}

// ====== Class FetchUrl ===================//
var FetchUrl = function(url){
  this.url = url;
  this.string;
//  this.matches;
//  this.text;
  
  // - Get Web Data by H1, H2, H3, H4, and Normal Text -
  this.getWebData = function(){
    this.getContent();
    var h1 = this.find_all("h1");
    var h2 = this.find_all("h2");
    var h3 = this.find_all("h3");
    var h4 = this.find_all("h4");
    var p = this.find_all("p");
    // Save all data
    var summary = {
      heading1: h1,
      heading2: h2,
      heading3: h3,
      heading4: h4,
      normalText: p
    }
//  Logger.log(summary)
    return summary;
  }
  
  // -
  this.getContent = function() { 
    this.string = UrlFetchApp.fetch(this.url).getContentText();
//    Logger.log(this.string);
    return this;
  };
  // Get elements by tag name and extract clear paragraphs
  this.find_all = function(tagName){
    var tagRegExp = "<"+tagName+"(.|\\n)*?\/\\s*"+tagName+">";//<p(.|\\n)*?\/p> // 
    var regExp = new RegExp(tagRegExp, 'gim');
    var matches = this.string.match(regExp);
//    Logger.log(regExp);
//    Logger.log(matches.length);
    var regExpInnerText = new RegExp("\>(.+)\<\/", 'im'); // 
    var regExpScriptRemov = new RegExp("<script(.|\\n)*?\/\\s*script>", 'gim');
    var textArr = [];
    if(matches != null){                                  // if found any - do...
//      Logger.log(matches.length);
      for(var i = 0; i< matches.length; i++){
        
        var text = '';
//        Logger.log(matches[i]);
        text = matches[i].replace(regExpScriptRemov, ""); // remove script   
//        text = matches[i]//.match(regExpInnerText)[1];  // return inner text
        var regExpTags = new RegExp("<[^>]*>", 'gim');    // remove extra tags 
        text = text.replace(regExpTags, "").trim();      // remove all tags
        if(text != '&nbsp;' && text != ""){
          textArr.push(text);
        }
//        Logger.log(i);
//        Logger.log(text);
      }
    }
//    Logger.log(textArr);
    return textArr;                                        // return array
  }
}  

