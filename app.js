var express = require('express');
var bodyparser = require('body-parser');
var stylus = require('stylus');
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect("mongodb://crespoter:blantest@ds157112.mlab.com:57112/crespoter", (err, database) => {
    if (err)
        console.log(err);
    db = database;
    app.listen(process.env.PORT, () => {
        console.log("listening to port "+ process.env.PORT | 3000);
    });
});
var app = express();
app.set('view engine', 'pug');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public')); 
app.get('/', (req, res) => {
    res.render('index.pug');
});
app.get('/shorten/*', function (req, res) {
    console.log(req.params[0]);
    var webAddressPattern = /(http|https):\/\/www.\S+\.\S+/
    if (!webAddressPattern.test(req.params[0])) {
        var urlObject = {
            status: "Invalid url"
        };
        db.collection("urls").save(urlObject);
        res.json(urlObject);
    }
    else {
        console.log(webAddressPattern.test(req.params.url));
        db.collection("urls").find().count().then(function (numItems) {
            var urlObject = {
                _id: numItems,
                url: req.params[0]
            };
            db.collection("urls", { autoIndexId: false }).save(urlObject);
            res.json(urlObject);
        });
    }
    
});

app.get('/:id', function (req, res) {
    var id = req.params.id;
    db.collection("urls").find({ "_id": parseInt(id,10) }).toArray(function (err, results) {
        if (err)
        {
            console.log(err);
        }
        if (results.length == 0)
        {
            var jsonRet = {
                status : "Invalid id"
            }
            res.json(jsonRet);
        }
        else
        {
            res.json(results[0]);
        }
    })
})




