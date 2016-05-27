        //Clear 
        function clearPage() {
            $("#street").prop('value',"");
            $("#city").prop('value',"");
            $('#state').prop('selectedIndex',0);
            $('#degreeF').prop("checked", true);    
            var validator = $("#mainForm").validate();
            validator.resetForm();
            $(".result").hide();
        }
        //Modal window
        function showModal(day) {
            $("#" + day + "Modal").modal("show");
        }
        //Show and hidden parts
        function toggle(hideNum) {
            if($(".hour" + hideNum).css('display') == 'none') {
                    $(".hour" + hideNum).show();
                }
                else {
                    $(".hour" + hideNum).hide();
                }
        }
        //Post to facebook
        window.fbAsyncInit = function() {
            FB.init({
                appId      : '737002429765081',
                xfbml      : true,
                version    : 'v2.5'
            });
        };

        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
        
        function postNew() {
            var title = 'Current Weather' + $(".postTitle").text();
            var summary = $(".postSumary").text() + ", " + $(".postDegree").text() + $(".tab1Sup").text();
            var img = $(".titleImg").prop('src');
            FB.ui({
                method: 'feed',
                name: title,
                description: summary,
                link: 'http://forecast.io/',
                picture: img,
                caption: 'WEATHER INFORMATION FROM FORECAST.IO',
                }, function(response){
                    if (response && !response.error_message) {
                        alert('Posted Successfully.');
                    } else {
                        alert('Not Posted.');
                    }
            });
        }
        
        function postToFacebook() {
            FB.getLoginStatus(function(response) {
                if(response.status == 'connected' || response.status == 'not_authorized') {
                    postNew();
                }
                else {
                    FB.login(function(response) {
                        if (response.authResponse) {
                            postNew();
                        } 
                    });
                }
            });
        }
        //Validate and submit form
        $.validator.addMethod("notAllSpace", function(value, element) { 
            return !(/^\s+$/.test(value)) && value != ""; 
        }, "No space please and don't leave it empty");
        $.validator.addMethod("valueNotEquals", function(value, element, arg){
            return arg != value;
        }, "Value must not equal arg.");
        $().ready(function() {
            $("#mainForm").validate({
                rules: {
                    state: { valueNotEquals: "default"},
                    street: {notAllSpace: true},
                    city: {notAllSpace: true}
                    
                },
                
                messages: {
                    street: "Please enter the street address",
                    city: "Please enter the city",
                    state: "Please select a state"
                },
                submitHandler: function(form) {
                    var form = $("#mainForm");
                    $.ajax({
                        url: '/getInfo',
                        type: 'GET',
                        data: $("#mainForm").serialize(),
                        dataType: 'json',
                        //Generate result
                        success: function(result) {
                            var data = result;
                            
                            ////Add table data of tab 1
                            var icon = data.currently.icon;
                            var summary = data.currently.summary;
                            var img;
                            switch(icon) {
                                case "clear-day":
                                    img = "clear.png";
                                    break;
                                case "clear-night":
                                    img = "clear_night.png";
                                    break;
                                case "rain":
                                    img = "rain.png";
                                    break;
                                case "snow":
                                    img = "snow.png";
                                    break;
                                case "sleet":
                                    img = "sleet.png";
                                    break;
                                case "wind":
                                    img = "wind.png";
                                    break;
                                case "fog":
                                    img = "fog.png";
                                    break;
                                case "cloudy":
                                    img = "cloudy.png";
                                    break;
                                case "partly-cloudy-day":
                                    img = "cloud_day.png";
                                    break;
                                case "partly-cloudy-night":
                                    img = "cloud_night.png";
                                    break;
                            }
                            var imgURL = "images/" + img;
                            img = "<img class=\"center-block titleImg\" src=\"images/" + img + "\" alt=\"" + summary + "\" title =\"" + icon + "\">";
                            $("#image").html(img);
                            $("#top").html("<span class=\"postSumary\">" + summary + "</span><span class=\"postTitle\"> in " + $("#city").val() + ", " + $("#state").val() + "</span>");
                            var degree;
                            if($("input[name='degree']:checked").val() == "Fahrenheit") {
                                degree = "&deg F";
                            }
                            else {
                                degree = "&deg C";
                            }
                            $("#mid").html("<span class=\"postDegree\">" + Math.round(data.currently.temperature) + "</span><sup class=\"tab1Sup\">" + degree + "</sup>");
                            $("#boundary").html("<span style=\"color: blue\">L: " + Math.round(data.daily.data[0].temperatureMin) + "&deg</span>" + " | " + "<span style=\"color: green\">H: " + Math.round(data.daily.data[0].temperatureMax) + "&deg</span>");
                            var precipitation = data.currently.precipIntensity;
                            if($("input[name='degree']:checked").val() == "Celsius") {
                                   precipitation *= 0.0393700787;
                            }
                            var precp;
                            switch(precipitation) {
                                case 0:
                                    precp = "None";
                                    break;
                                case 0.002:
                                    precp = "Very Light";
                                    break;
                                case 0.017:
                                    precp = "Light";
                                    break;
                                case 0.1:
                                    precp = "Moderate";
                                    break;
                                case 0.4:
                                    precp = "Heavy";
                                    break;
                            }
                            $("#precipitation").html(precp);
                            var chanceOfRain = data.currently.precipProbability * 100 + "%";
                            $("#chanceOfRain").html(chanceOfRain);
                            var windSpeed = data.currently.windSpeed.toFixed(2) + " mph";
                            if($("input[name='degree']:checked").val() == "Celsius") {
                                   windSpeed = (data.currently.windSpeed * 2.23693629).toFixed(2) + " mph";
                            }
                            $("#windSpeed").html(windSpeed);
                            var dewPoint = data.currently.dewPoint.toFixed(2) + degree;
                            $("#dewPoint").html(dewPoint);
                            var humidity = Math.round(data.currently.humidity * 100) + "%";
                            $("#humidity").html(humidity);
                            var visibility = data.currently.visibility.toFixed(2) + " mi";
                            if($("input[name='degree']:checked").val() == "Celsius") {
                                visibility = (data.currently.visibility * 0.621371192).toFixed(2) + " mi";
                            }
                            $("#visibility").html(visibility);
                            var sunrise = moment.tz(data.daily.data[0].sunriseTime * 1000, data.timezone).format('hh:mm A');
                            var sunset = moment.tz(data.daily.data[0].sunsetTime * 1000, data.timezone).format('hh:mm A');
                            $("#sunrise").html(sunrise);
                            $("#sunset").html(sunset);
                            
                            
                            ////Add map
                            $(".mapContainer").html("<div id=\"map\" style=\"width: 100%; height: 475px;\"></div>");
                            var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '[Map data © OpenStreetMap contributors, CC-BY-SA]' });
                            var clouds = L.OWM.clouds({showLegend: false, opacity: 0.5, errorTileUrl: "LoadingFail.png"});
                            var precpi = L.OWM.precipitation({showLegend: false, opacity: 0.5, errorTileUrl: "LoadingFail.png"});
                            var map = L.map('map', { center: new L.LatLng(data.latitude, data.longitude), zoom: 10, layers: [osm, clouds, precpi] });
                            var baseMaps = { "OSM Standard": osm };
                            var overlayMaps = { "Clouds": clouds, "precipitations": precpi };
                            var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);
                                          
                            ////Add next 24 hours
                            $(".tab2Row").html("<tr></tr>");
                            if($("input[name='degree']:checked").val() == "Fahrenheit") {
                                degree = "&deg" + "F";
                            }
                            else {
                                degree = "&deg" + "C";
                            }
                            $("th.temp").html("Temp" + "(" + degree + ")");
                            for(i = 1; i <= 24; i++) {
                                var time = moment.tz(data.hourly.data[i].time * 1000, data.timezone).format('hh:mm A');
                                var icon = data.hourly.data[i].icon;
                                var img;
                                switch(icon) {
                                    case "clear-day":
                                        img = "clear.png";
                                        break;
                                    case "clear-night":
                                        img = "clear_night.png";
                                        break;
                                    case "rain":
                                        img = "rain.png";
                                        break;
                                    case "snow":
                                        img = "snow.png";
                                        break;
                                    case "sleet":
                                        img = "sleet.png";
                                        break;
                                    case "wind":
                                        img = "wind.png";
                                        break;
                                    case "fog":
                                        img = "fog.png";
                                        break;
                                    case "cloudy":
                                        img = "cloudy.png";
                                        break;
                                    case "partly-cloudy-day":
                                        img = "cloud_day.png";
                                        break;
                                    case "partly-cloudy-night":
                                        img = "cloud_night.png";
                                        break;
                                }
                                var summary = data.hourly.data[i].summary;
                                img = "<img class=\"tag2Img\" src=\"images/" + img + "\" alt=\"" + summary + "\" title =\"" + icon + "\">";
                                var cloudCover = Math.round(data.hourly.data[i].cloudCover * 100) + "%";
                                var temp = data.hourly.data[i].temperature.toFixed(2);
                                var cross = "<span class=\"glyphicon glyphicon-plus\" id=\"hour" + i + "\" onclick=\"toggle(" + i + ")\"></span>";
                                var newRow = "<tr class=\"normalRow" + "\">" + "<td>" + time + "</td>" + "<td>" + img + "</td>" + "<td>" + cloudCover + "</td>" + "<td>" + temp + "</td>" + "<td>" + cross + "</td></tr>";
                                $(".tab2Row tr:last").after(newRow);
                                //Add toggle parts
                                newRow = "<tr class=\"hour" + i + " active hideRow" + "\">" + "<td colspan=\"5\"><div class=\"hideDiv\"><ul class=\"list1\"><li><b>Wind</b></li>" + "<li><b>Humidity</b></li>" + "<li><b>Visibility</b></li>" + "<li><b>Pressure</b></li></ul>";                     
                                var wind = data.hourly.data[i].windSpeed.toFixed(2) + "mph";
                                if($("input[name='degree']:checked").val() == "Celsius") {
                                   wind = (data.hourly.data[i].windSpeed * 2.23693629).toFixed(2) + "mph";
                                }
                                var humidity = Math.round(data.hourly.data[i].humidity * 100) + "%";
                                var visibility = data.hourly.data[i].visibility + "mi";
                                if($("input[name='degree']:checked").val() == "Celsius") {
                                    visibility = (data.hourly.data[i].visibility * 0.621371192).toFixed(2) + " mi";
                                }
                                var pressure = data.hourly.data[i].pressure + "mb";
                                newRow += "<ul class=\"list2\">" + "<li>" + wind + "</li>" + "<li>" + humidity + "</li>" + "<li>" + visibility + "</li>" + "<li>" + pressure + "</li></ul></div></td></tr>";
                                $(".tab2Row tr:last").after(newRow);
                                $(".tab2Row tr:last").after("<tr class=\"emptyRow hour" + i + "\"><td colspan=\"5\"></td></tr>");
                            }
                            
                            ////Add next week
                            for(i = 1; i <= 7; i++) {
                                var content = "<div><b>";
                                var day = moment.tz(data.daily.data[i].time * 1000, data.timezone).format('dddd');
                                content += day + "</b></div>";
                                var monthDate = moment.tz(data.daily.data[i].time * 1000, data.timezone).format('MMM D');
                                content += "<div><b>" + monthDate + "</b></div>";
                                var icon = data.daily.data[i].icon;
                                var img;
                                switch(icon) {
                                    case "clear-day":
                                        img = "clear.png";
                                        break;
                                    case "clear-night":
                                        img = "clear_night.png";
                                        break;
                                    case "rain":
                                        img = "rain.png";
                                        break;
                                    case "snow":
                                        img = "snow.png";
                                        break;
                                    case "sleet":
                                        img = "sleet.png";
                                        break;
                                    case "wind":
                                        img = "wind.png";
                                        break;
                                    case "fog":
                                        img = "fog.png";
                                        break;
                                    case "cloudy":
                                        img = "cloudy.png";
                                        break;
                                    case "partly-cloudy-day":
                                        img = "cloud_day.png";
                                        break;
                                    case "partly-cloudy-night":
                                        img = "cloud_night.png";
                                        break;
                                }
                                var summary = data.daily.data[i].summary;
                                var img1 = "<img class=\"tab3Img\" src=\"images/" + img + "\" alt=\"" + summary + "\" title =\"" + icon + "\">";
                                content += "<div>" + img1 + "</div>" + "<div>Min<br>Temp</div></div>";
                                var minTemp = Math.round(data.daily.data[i].temperatureMin);
                                content += "<div class=\"tab3Temp\"><b>" + minTemp + "<span class=\"tab3Sup\">&deg</span></b></div><div>Max<br>Temp</div>";
                                var maxTemp = Math.round(data.daily.data[i].temperatureMax);
                                content += "<div class=\"tab3Temp\"><b>" + maxTemp + "<span class=\"tab3Sup\">&deg</span></b>";
                                $(".day" + i).html(content);
                                //Add popup
                                var modal = "";
                                modal += "<div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button><h4 class=\"modal-title\">";
                                var title = "<p class=\"modalHeader\">Weather in " + $("#city").val() + " on " + monthDate + "</p></div>";
                                modal += title + "<div class=\"modal-body\">";
                                img1 = "<img class=\"modalImg\" src=\"images/" + img + "\" alt=\"" + summary + "\" title =\"" + icon + "\">";
                                modal += "<div class=\"row\"><div class=\"col-md-12\">" + img1 + "</div></div>";
                                modal += "<div class=\"row\"><div class=\"col-md-12 modalSummary\">" + day + ": " + "<span class=\"modalInner\">" + summary + "</span></div></div>";
                                modal += "<div class=\"row\"><div class=\"col-xs-12 col-sm-4 col-md-4 modalBlock\">"
                                var sunrise = moment.tz(data.daily.data[i].sunriseTime * 1000, data.timezone).format('hh:mm A');
                                var sunset = moment.tz(data.daily.data[i].sunsetTime * 1000, data.timezone).format('hh:mm A');
                                var humidity = Math.round(data.daily.data[i].humidity * 100) + "%";
                                var wind = data.daily.data[i].windSpeed.toFixed(2) + "mph";
                                if($("input[name='degree']:checked").val() == "Celsius") {
                                   wind = (data.daily.data[i].windSpeed * 2.23693629).toFixed(2) + "mph";
                                }
                                var visibility = data.daily.data[i].visibility + "mi";
                                if($("input[name='degree']:checked").val() == "Celsius") {
                                    visibility = (data.daily.data[i].visibility * 0.621371192).toFixed(2) + " mi";
                                }
                                var pressure = data.daily.data[i].pressure + "mb";
                                modal += "<span class=\"modalText\">Sunrise Time</span><br>" + sunrise + "<br>" + "<span class=\"modalText\">Wind Speed</span><br>" + wind + "</div>";
                                modal += "<div class=\"col-xs-12 col-sm-4 col-md-4 modalBlock\"><span class=\"modalText\">Sunset Time</span><br>" + sunset + "<br>" + "<span class=\"modalText\">Visibility</span><br>" + visibility + "</div>";
                                modal += "<div class=\"col-xs-12 col-sm-4 col-md-4 modalBlock\"><span class=\"modalText\">Humidity</span><br>" + humidity + "<br>" + "<span class=\"modalText\">Pressure</span><br>" + pressure + "</div></div></div>";
                                modal += "<div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button></div></div>";
                                $("#day" + i + "Modal").html(modal);
                                
                            }                         
                            $(".result").show();
                            $('.nav a:first').tab('show');
                            map.invalidateSize();
                        }
                        
                    });
                }
            });
            
        });