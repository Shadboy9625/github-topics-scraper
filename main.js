const request = require("request");
const cheerio = require("cheerio");
const getReposPageHtml = require("./reposPage");
const { Console } = require("console");

let url = "https://github.com/topic";

request(url, cb);
function cb(err, response, html){
    if (err) {
        console.log(err);
    } else if (response.statusCode == 404) {
        console.log("page not found");
    }
    else {
        // console.log(html);
        getTopicsLink(html);
    }
}

function getTopicsLink(html){
    let $ = cheerio.load(html);
    let linkElemArr = $('.no-underline.d-flex.flex-column.flex-justify-center');
    for (let i=0; i<linkElemArr.length; i++) {
       let href =  $(linkElemArr[i]).attr("href");
       let topic = href.split("/").pop();
       let topicLink = `https://github.com/${href}`;
       getReposPageHtml(topicLink, topic);
    }
}