var express = require('express');
var app = express();

var people = [];

app.get('/nearby', function(req, res){
  res.send(people);
});

app.get('/update', function(req, res) {
    var lat = req.query.lat;
    var lon = req.query.lon;
    var name = req.query.name;
    var id = req.query.deviceid;

    var foundPerson = false;
    for(var i = 0; i < people.length; i++) {
        var person = people[i];
        if (person.id == id) {
            foundPerson = true;
            //update a person
            person.name = name;
            person.lat = lat;
            person.lon = lon;
        };
    }
    if (!foundPerson) {
        var newPerson = {
            id : id,
            name: name,
            lat: lat,
            lon: lon
        }
        people.push(newPerson);
    }
    res.send(people)
});

app.listen(9000);