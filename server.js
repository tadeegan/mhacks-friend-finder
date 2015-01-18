var express = require('express');
var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("connected to mongo")
  // yay!
});

//var Schema = mongoose.Schema;
var Schema = mongoose.Schema;

var peopleSchema = new Schema({
    name: String,
    lat: Number,
    lon: Number,
    deviceID: String,
    time: Number

})

var Person = mongoose.model('people', peopleSchema);


app.get('/clear', function (req, res) {
    Person.remove({}, function (err) {
        res.send(err || "done");
    });
    
});
//

app.get('/update', function (req, res) {
    

    console.log("request");
    var lat = parseFloat(req.query.lat);
    var lon = parseFloat(req.query.lon);
    var name = req.query.name;
    var id = req.query.deviceid;
    var time = new Date().getTime();
    
    Person.findOne({ deviceID: req.query.deviceid }).exec(function (err, person) {
        console.log(person);
        if (err) return;
        if (person == null) {
            person = new Person();
        }
        person.lat = lat;
        person.lon = lon;
        person.name = name;
        person.deviceID = id;
        person.time = time;
        person.save();
    });
    var d = .01;
    Person.find()
    .where('lat').gt(lat - d).lt(lat + d)
    .where('lon').gt(lon - d).lt(lon + d)
    .exec(function (err, people) {
        if (!err) {
            var a = people.map(dbtohttpparams)
            res.send(a);
        }
    });
    
});

function dbtohttpparams(dbperson)
{
    return {
        lat: dbperson.lat, lon: dbperson.lon,
        name: dbperson.name, id: dbperson.deviceID
    }
}


setInterval(
    function filter() {
        Person.remove()
        .where('time').lt(new Date().getTime() - 10)
        .exec(function (err){
            if (err) {
                return handleError(err);
            }
            
        })
        },
10000);



app.listen(5858);