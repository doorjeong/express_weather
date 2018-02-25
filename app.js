var path = require("path");
var express = require("express");
var zipdb = require("zippity-do-dah");
var ForecastIo = require("forecastio");

var app = express();
var weather = new ForecastIo("YOUR FORECAST.IO API KEY HERE");

// static assets의 path 설정
app.use( express.static(path.resolve(__dirname, "public")) );

// html view rendering (ejs) setting
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");



// root 접속시 index 페이지
app.get("/", function(req, res){
    res.render("index");
});

// /ddddd (5자리의 숫자) 형식으로 접속시 처리하는 라우터
app.get(/^\/(\d{5})$/, function(req, res, next){
    var zipcode = req.params[0]; // 접속한 /ddddd 에서 그 5자리의 숫자
    var location = zipdb.zipcode(zipcode);
    console.log(location);
    if( !location.zipcode ){
        console.log("location.zipcode 에러 : ", location.zipcode);
        next();
        return;
    }

    var latitude = location.latitude; // 위도
    var longitude = location.longitude; // 경도

    console.log(latitude, longitude)

    weather.forecast(latitude, longitude, function(err, data){
        if( err ){ // 에러 발생시 다음 미들웨어(404)로 넘어감
            console.log("forecast 에러 : ", err);
            next();
            return;
        }
        res.json({ // JSON 개체를 전송
            zipcode: zipcode,
            temperature: data.currently.temperature
        });
    });
});

app.use(function(req, res){
    res.status(404).render("404");
});

app.listen(3000);
