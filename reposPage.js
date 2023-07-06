const request = require('request');
const cheerio = require('cheerio');
const getIssuesPageHtml = require('./issue');

function getReposPageHtml(url, topic) {
    request(url, cb);

    function cb(err, response, html){
        if (err) {
            console.log(err);
        } else if (response.statusCode == 404) {
            console.log("page not found");
        }
        else{
            //console.log(html);
            getReposLink(html);
        }
    }

    function getReposLink(html){
        let $ = cheerio.load(html);
        console.log(topic);
        let headingsArr = $(".f3.color-fg-muted.text-normal.lh-condensed")
        for (let i = 0; i < 8; i++) {
            let twoAnchors = $(headingsArr[i]).find("a");
            let link = $(twoAnchors[1]).attr("href");
            //console.log(link);
            let issuesLink = `https://github.com${link}/issues`;
            //console.log(issuesLink);
            let repoName = link.split("/").pop();
            getIssuesPageHtml(issuesLink, topic, repoName);
        }
        console.log("``````````````````````````````````````````");
    }


}

module.exports = getReposPageHtml;