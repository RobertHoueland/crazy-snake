var path = require("path")
var express = require("express")
var exphbs = require("express-handlebars")

// Use server to actually take in player scores.
var scoreData = require("./testData.json")

var app = express()
var port = process.env.PORT || 3000

app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")

app.use(express.static("public"))

app.get("/", function (req, res, next) {
    //Add if data not good later
    res.status(200).render("homePage", { players: scoreData })
})

app.get("/scores", function (req, res, next) {
    res.status(200).render("table")
})

app.get("*", function (req, res, next) {
    res.status(404).render("404Page")
})

app.listen(port, function () {
    console.log("== Server is listening on port", port)
})
