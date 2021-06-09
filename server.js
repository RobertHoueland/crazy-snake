var path = require("path")
var express = require("express")
var exphbs = require("express-handlebars")
var bodyParser = require("body-parser")
var fs = require("fs")

// Use server to actually take in player scores.
var scoreData = require("./scores.json")

var app = express()
var port = process.env.PORT || 3000

app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static("public"))

app.get("/", function (req, res, next) {
    res.status(200).render("homePage", { displayAll: true, players: scoreData })
})

app.post("/submit", function (req, res) {
    var user = {
        username: req.body.name,
        score: req.body.score,
    }
    if (user) {
        scoreData.push(user)
        fs.writeFile(
            "./scores.json",
            JSON.stringify(scoreData, null, 2),
            function (err) {
                if (err) {
                    res.status(500).send(
                        "Error writing new data.  Try again later."
                    )
                } else {
                    res.status(200).send()
                }
            }
        )
    } else {
        res.status(400).send(
            "Request needs a JSON body with 'username' and 'score'."
        )
    }

    res.redirect("/")
})

app.get("/scores", function (req, res, next) {
    res.status(200).render("homePage", { players: scoreData })
})

app.get("*", function (req, res, next) {
    res.status(404).render("404Page")
})

app.listen(port, function () {
    console.log("== Server is listening on port", port)
})
