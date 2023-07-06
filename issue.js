const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const pdfkit = require('pdfkit');
let xlsx = require("xlsx");

function getIssuesPageHtml(url, topic, repoName) {
    request(url, cb);

    function cb(err, response, html){
        if (err) {
            console.log(err);
        } else if (response.statusCode == 404) {
            console.log("page not found");
        }
        else{
            //console.log(html);
            getIssues(html);
        }
    }

    function excelWriter(filePath, json, sheetName) {
        //new worksheet
        let newWB = xlsx.utils.book_new();
        //json data => excel format convert
        let newWS = xlsx.utils.json_to_sheet(json);
        // pass your WB, WS, sheet_name
        xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
        //filePath
        xlsx.writeFile(newWB, filePath);
    }

    function getIssues(html) {
        let $ = cheerio.load(html);
        let issuesArr = $(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title");
        console.log(issuesArr.length);
        let arr = [];
        for (let i = 0; i < issuesArr.length; i++) {
            let link = $(issuesArr[i]).attr("href");
            //console.log(link);
            arr.push(link);
        }
        //console.log(topic, "       ", arr);
        let folderPath = path.join(__dirname, topic);
        dirCreator(folderPath);
        let filePath = path.join(folderPath, repoName+".pdf");
        let text = JSON.stringify(arr);
        let pdfDoc = new pdfkit();
        pdfDoc.pipe(fs.createWriteStream(filePath));
        pdfDoc.text(text);
        pdfDoc.end();

        //fs.writeFileSync(filePath, JSON.stringify(arr));
    }
}

module.exports = getIssuesPageHtml;

function dirCreator(folderPath){
    if (fs.existsSync(folderPath) == false){
        fs.mkdirSync(folderPath);
    }
}