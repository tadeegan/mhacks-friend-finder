var express = require('express');
var app = express();

var people = [];
function toRadians(degree)
{
    return degree/180*3.1415;
}

function distance(lat1,lon1,lat2,lon2)
            {
                var R = 6371.0; //km


                var o1 = toRadians(lat1);
                var o2 = toRadians(lat2);
                var ao = toRadians((lat2-lat1));
                var ay = toRadians((lon2-lon1));

                var a = Math.sin(ao/2) * Math.sin(ao/2) +
                Math.cos(o1) * Math.cos(o2) *
                Math.sin(ay/2) * Math.sin(ay/2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

                var d = R * c;
                console.log("lat1 " + lat1 + "lat2 " + lat2 + "lon1 " + lon1 +"lon2 " + lon2);
                console.log("d " + d);
                if(d <= 2.0)
                {
                    return true;
                }
                return false;

            }
app.get('/update', function(req, res) {
    console.log("request");
    var lat = parseFloat(req.query.lat);
    var lon = parseFloat(req.query.lon);
    var name = req.query.name;
    var id = req.query.deviceid;
    var time = new Date().getTime();

    var foundPerson = false;
    for(var i = 0; i < people.length; i++) {
        var person = people[i];
        if (person.id == id) {
            foundPerson = true;
            //update a person
            person.name = name;
            person.lat = lat;
            person.lon = lon;
            person.time = time
        };
    }
    if (!foundPerson) {
        var newPerson = {
            id : id,
            name: name,
            lat: lat,
            lon: lon,
            time: time
        }
        people.push(newPerson);
    }
    var milePeople = [];
    for(var i = 0; i < people.length; i++) 
    {
        console.log(people[i].name + " " + name)
        if( distance(lat, lon, people[i].lat, people[i].lon) )
        {
            milePeople.push(people[i]);
        }
    }    
    res.send(milePeople)

});

setInterval(
function filter()
{
    console.log("filter");
    for(var i = 0; i < people.length; i++)
    {
        var person = people[i];
        if(person.time + 10000 < new Date().getTime())
        {
            console.log("Removing " + person.name);
            people.splice(i, 1);
        }
    }
},
10000);



app.listen(9000);