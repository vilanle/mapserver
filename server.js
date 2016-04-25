//dependencies for each module used
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session');
var dotenv = require('dotenv');
var pg = require('pg');
var app = express();

//client id and client secret here, taken from .env (which you need to create)
dotenv.load();

//connect to database
var conString = process.env.DATABASE_CONNECTION_URL;

//Configures the Template engine
app.engine('html', handlebars({ defaultLayout: 'layout', extname: '.html' }));
app.set("view engine", "html");
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'keyboard cat',
                  saveUninitialized: true,
                  resave: true}));

//set environment ports and start application
app.set('port', process.env.PORT || 3000);

//routes
app.get('/', function(req, res){
  res.render('index');
});

// app.get('/zips_us_topo.json'), function(req,res){
//   res.render('index');
// }
//var query = 'SELECT cdph_smoking_prevalence_in_adults_1984_2013.gender, cdph_smoking_prevalence_in_adults_1984_2013.number_of_respondents FROM cogs121_16_raw.cdph_smoking_prevalence_in_adults_1984_2013 WHERE cdph_smoking_prevalence_in_adults_1984_2013.year = \'2013\'';

var query = 'SELECT INCOME."Area", CASE WHEN INCOME."Median Household Income" BETWEEN \'$40000.00\' AND \'$49000.00\' THEN 40000 WHEN INCOME."Median Household Income" BETWEEN \'$50000.00\' AND \'$59000.00\' THEN 50000 WHEN INCOME."Median Household Income" BETWEEN \'$60000.00\' AND \'$69000.00\' THEN 60000 WHEN INCOME."Median Household Income" BETWEEN \'$70000.00\' AND \'$79000.00\' THEN 70000 WHEN INCOME."Median Household Income" BETWEEN \'$80000.00\' AND \'$89000.00\' THEN 80000 WHEN INCOME."Median Household Income" BETWEEN \'$90000.00\' AND \'$99000.00\' THEN 90000 WHEN INCOME."Median Household Income" BETWEEN \'$100000.00\' AND \'$109000.00\' THEN 100000 WHEN INCOME."Median Household Income" BETWEEN \'$110000.00\' AND \'$119000.00\' THEN 110000 WHEN INCOME."Median Household Income" BETWEEN \'$120000.00\' AND \'$129000.00\' THEN 1200000 ELSE 150000 END AS "Avg Income",  HOME_VALUE."Median house value", POVERTY."Total population below poverty" AS "Poverty_Count", COUNT(CRIMES."zip") AS "Number_of_Crimes" FROM cogs121_16_raw.hhsa_san_diego_demographics_median_income_2012_norm AS INCOME INNER JOIN cogs121_16_raw.hhsa_san_diego_demographics_home_value_2012 AS HOME_VALUE ON INCOME."Area" = HOME_VALUE."Area" INNER JOIN cogs121_16_raw.hhsa_san_diego_demographics_poverty_2012 AS POVERTY ON POVERTY."Area" = INCOME."Area" LEFT OUTER JOIN cogs121_16_raw.arjis_crimes AS CRIMES ON LOWER(CRIMES."community") = LOWER(INCOME."Area") GROUP BY INCOME."Area", "Avg Income", HOME_VALUE."Median house value", POVERTY."Total population below poverty"'


app.get('/delphidata', function (req, res) {

    var pg = require('pg');

    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

        client.query(query, function(err, result) {
            done();

            if(err) {
              return console.error('error running query', err);
            }
            res.json(result.rows);
        });
    });
});

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
