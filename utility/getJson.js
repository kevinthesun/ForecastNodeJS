var http = require('http');
var request = require('request');

var APICall = function (req, res) {
    var url = "http://maps.google.com/maps/api/geocode/xml?address=" + encodeURIComponent(req.param('street')) + "," + encodeURIComponent(req.param('city')) + "," + encodeURIComponent(req.param('state'));
    http.get(url, (res1) => {
        var xml = '';
        res1.on('data', function (chunk) {
            xml += chunk;
        });
        res1.on('end', function() {
            var parseString = require('xml2js').parseString;
            parseString(xml, function (err, result) {
                var lat = result.GeocodeResponse.result[0].geometry[0].location[0].lat;
                var lng = result.GeocodeResponse.result[0].geometry[0].location[0].lng;
                console.log(lat);
                console.log(lng);
                var units = req.param('degree') == "Fahrenheit" ? "us" : "si";
                var weatherUrl = "https://api.forecast.io/forecast/1612f98ab37debd29fef9b0290f8ca95/" + encodeURIComponent(lat) + "," + encodeURIComponent(lng) + "?units=" + encodeURIComponent(units) + "&exclude=flags";
                request(weatherUrl, function(error, response, res2) {
                    res.send(res2);
                });
            });
        })
    }).on('error', (e) => {
        console.log("Error occurs");
    });
}

module.exports = APICall;