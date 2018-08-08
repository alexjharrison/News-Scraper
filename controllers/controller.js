var db = require("../models");
var cheerio = require("cheerio");
var request = require("request");


module.exports = (app) => {
    // db.Note.create({
    //     note: "This is a note"
    // }).then(response=>{
    //     console.log(response);
    // })

    app.get("/", (req, res) => {
        var empty = false;
        db.Article.find({}).then(result => {
            if (result[0]) empty = true;
            result.empty = empty;
            result.home = true;
            res.render("index", result);
        })
    })
    app.get("/saved", (req, res) => {
        var empty = false;
        db.Article.find({}).then(result => {
            if (result[0]) empty = true;
            result.empty = empty;
            result.home = false
            res.render("index", result);
        })
    })
    app.get("/newArticles", (req, res) => {

        request("https://arstechnica.com", (error, response, html) => {
            var $ = cheerio.load(html);
            var stories = [];
            $("h2").each((i, element) => {
                var story = {}
                story.url = $(element).children().attr("href");
                story.title = $(element).children().text();
                story.subHeadline = $(element).next("p.excerpt").text();
                story.image = $(element).parent().prev("figure").children(".listing").attr("style");
                
                //change crappy thumbnail images to full quality
                if(story.image) {
                    story.image = story.image.split("'")[1];
                    var start = story.image.length-12;
                    var end = story.image.length-4;
                    if(story.image.includes(".jpeg")) {start--,end--}
                    var imgSize = story.image.slice(start,end);
                    console.log(imgSize);
                    story.image = story.image.replace(imgSize,"")
                }

                if (story.url && story.title && story.subHeadline && story.image) {
                    stories.push(story);
                }
            })
            db.Article.find({}).then(dbStories => {
                var titles = dbStories.map(dbStory => dbStory.title);
                stories.forEach(story => {
                    if (!titles.includes(story.title)) {
                        dbStories.push(story);
                        db.Article.create(story);
                    }
                });
                res.send(dbStories);
            });
        })
    })
    app.get("/dropArticles", (req, res) => {
        db.Article.remove({})
            .then(result => { db.Article.find({}, (err, r) => { res.json(r); }) })
        db.Note.remove({}).then(result => { });
    })
    app.post("/savearticle/:id",(req,res)=>{
        let id = req.params.id;
        console.log(id)
        db.Article.findOneAndUpdate({"_id":id},{saved:true})
        .then((r)=>res.json(r))
    })
    app.post("/removearticle/:id",(req,res)=>{
        let id = req.params.id;
        console.log(id)
        db.Article.findOneAndUpdate({"_id":id},{saved:false})
        .then((r)=>res.json(r))
    })




    app.get("*", (req, res) => {
        res.status(404).send("404 Not Found");
    })
}








