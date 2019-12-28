var pcppParser = require("pcpartpickerparser");
var request = require("request");
var JSDOM = require("jsdom").JSDOM;
var resolveRelative = require("resolve-relative-url");

module.exports = function (evt, _cfg, bot) {
    var pcPartListLinks =  evt.d.content.match(/(?:https?:\/\/pcpartpicker.com\/user\/[\d\w@\.\+-_]+\/saved\/[\d\w-]+)|(?:https?:\/\/pcpartpicker.com\/list\/[\d\w-]+)|(?:https?:\/\/pcpartpicker.com\/user\/[\d\w@\.\+-_]+\/saved\/#view=[\d\w-]+)/g);

    if(!pcPartListLinks) return false;
    else parseAndSendLists(pcPartListLinks.map(x=>x.replace("#view=","")), bot, evt);
}

function parseAndSendLists(links, bot, evt) {
    console.log(links);
    recursiveParseListPage(0, links, function(err, data) {
        if(err) return console.error(err);
        console.log(data);
        for(var i = 0; i < Math.min(links.length, 5); i++) {
            bot.sendMessage({
                to: evt.d.channel_id,
                embed: buildEmbed(data[i])
            });
        }


    });
}
function buildEmbed(pc) {
    if(!pc) return false;
    var componentFields = pc.components.map(function(comp) {
        return {
            "name": comp.type,
            "value": comp.name + " - " + comp.price,
            "inline": true
        };
    });
    return {
        title: pc.name,
        url: pc.url,
        description: `Price (minus shipping): ${pc.priceNoShip}; Total Price: ${pc.priceTotal}`,
        color: 8311585,
        author: {
            name: pc.username,
            url: `https://pcpartpicker.com/user/${pc.username}`,
            icon_url: pc.userimg
        },
        thumbnail: {
            url: pc.imageUrl
        },
        fields: componentFields
    }
}
function recursiveParseListPage(j, links, cbEnd, accumulator) {
    if(!accumulator) accumulator = [];
    request.get(links[j], function(err, res, bod) {
        if(err) return cbEnd(err);

        var dom = new JSDOM(bod);
        var pageTitle = dom.window.document.querySelector("title");
        var pageHeading = dom.window.document.querySelector("h1.pageTitle");
        var userDiv = dom.window.document.querySelector("div.user");
        var listTable = dom.window.document.querySelector("table.xs-col-12 tbody");

        var listJson = {};

        listJson.url = links[j];

        listJson.title = pageTitle.textContent;
        listJson.name = pageHeading.textContent;
        listJson.priceNoShip = listTable.querySelector(".tr__total .td__price").textContent;
        listJson.priceTotal = listTable.querySelector(".tr__total--final .td__price").textContent;

        listJson.username = userDiv.textContent;
        listJson.userimg = resolveRelative(userDiv.querySelector("img").getAttribute("src"), listJson.url);

        listJson.imageUrl = "https://pcpartpicker.com/static/responsive/images/default-avatar.png";
        listJson.components = [];

        for(var i = 0; i < listTable.children.length; i++) {
            var row = listTable.children[i];
            var rowJson = {};

            if(!row.querySelector(".td__component")) continue;

            rowJson.type = row.querySelector(".td__component").textContent;
            rowJson.image = resolveRelative(row.querySelector(".td__image").querySelector("img").getAttribute("src"), listJson.url);
            rowJson.name = row.querySelector(".td__name").textContent.trim();
            rowJson.baseprice = row.querySelector(".td__base").textContent;
            rowJson.price = row.querySelector(".td__price").textContent;

            if(rowJson.type == "Case") listJson.imageUrl = rowJson.image;

            listJson.components.push(rowJson);
        }

        accumulator.push(listJson);
        console.log("i is", j);

        if(links[j+1]) recursiveParseListPage(j+1, links, cbEnd, accumulator);
        else cbEnd(null, accumulator);
    });
}
module.exports.test = function() {
    module.exports({
        "d": {
            "content": "so summary message because scrolling\nhttps://pcpartpicker.com/user/ItzCloudy/saved/J6MPnQ - most upgrade-friendly\nhttps://pcpartpicker.com/user/ItzCloudy/saved/dshskL - most value and power, not as upgradable\nhttps://pcpartpicker.com/user/ItzCloudy/saved/sygYHx - Value/Power/Portability (i.e. college and occasional LAN)"
        }
    });
}
