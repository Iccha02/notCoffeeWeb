// BACKEND USED FOR notCoffeeMockBuild.html (Sep 2025)

// this will be the proxy API to the yelp API:
const http = require('http');
const hostname = 'localhost';

//const express = require('express');
//const app = express();

const port = 4000; // this means that /my-apis will go here:

// necessary:
var request = require('request'); // req lib that lets you make reqs
var mysql = require('mysql');
var querystring = require('querystring'); // queries in the URL


var baseURL='https://api.yelp.com/v3/businesses/search?term=';

var token ='xHnoTSXpbwB7QUmE3bXJSLFfwUy1Qtdx3ngzoFOOiyWCorl0zN3fjG_fB3mJIfeoDG0LD9A_QbXPPje5J6YUOXRr8ZDw9rTdGcnC_WtF84fuqtSTx_ujfVkBXirUYHYx';

// Now, I should be getting the result and handling it
var bearerAuth = 'Bearer ' + token;

console.log("BASE URL HERE " + baseURL);


function makeYelpRequestManual(term, place, responseToGenerate){
	
	var baseURL='https://api.yelp.com/v3/businesses/search?term=';
	
	url = baseURL + term + "&location=" + place + "&categories=coffee";
	console.log(url);
	
	console.log("TERM IN FUNC: " + term);
	console.log("TERM IN PLACE: " + place);
	
	console.log("MAKING YELP REQUEST and called function HERE!!!")
	console.log("URL IS " + baseURL);
	request({
		  url: url,
		  headers: { // special verison of param (like lang/lat) that you don't want to pass directly in url
			 'Authorization': bearerAuth
		  }
		}, function(err, res) {
			  if(err) {
				console.error(err);
			  } else {
				console.log("WE HAVE THE RESULTS! FOR " + term + " in " + place);
				//console.log(res.body);
			
				payload = JSON.parse(res.body);
				// parsing the JSON is super important, don't keep forgetting this!
				//console.log(payload.businesses); 
				
				result = payload.businesses;
				console.log(result);
				
				// i only want the top 3 right now!
				for(i = 1; i < 4; i++){
					console.log("Business number " + i  + ":");
					console.log(result[i].name);
				}
				
				response = {status: 200, success: true, info: result, term: term};
				
				responseToGenerate.end(JSON.stringify(response));

				// for (const [key, value] of Object.entries(res.body)) {
				//   console.log(value);
				// }
			  }
	});
}


function makeAutoYelpRequest(term, long, lat, responseToGenerate){
	
	var baseURL='https://api.yelp.com/v3/businesses/search?term=';
	
	url = baseURL + term + "&longitude=" + long + "&latitude=" + lat + "&categories=coffee";
	console.log(url);
	
	console.log("TERM IN FUNC: " + term);
	console.log("LONG IN PLACE: " + long);
	console.log("LAT IN PLACE: " + lat);
	
	console.log("MAKING YELP REQUEST and called function HERE!!!")
	console.log("URL IS " + baseURL);
	request({
		  url: url,
		  headers: { // special verison of param (like lang/lat) that you don't want to pass directly in url
			 'Authorization': bearerAuth
		  }
		}, function(err, res) {
			  if(err) {
				console.error(err);
			  } else {
				console.log("WE HAVE THE RESULTS! FOR " + term + " in long: " + long + " lat: " + lat);
				//console.log(res.body);
			
				payload = JSON.parse(res.body);
				// parsing the JSON is super important, don't keep forgetting this!
				//console.log(payload.businesses); 
				
				result = payload.businesses;
				console.log(result);
				
				// i only want the top 3 right now!
				for(i = 1; i < 4; i++){
					console.log("Business number " + i  + ":");
					console.log(result[i].name);
				}
				
				response = {status: 200, success: true, info: result, term: term};
				
				responseToGenerate.end(JSON.stringify(response));

				// for (const [key, value] of Object.entries(res.body)) {
				//   console.log(value);
				// }
			  }
	});
}

const server = http.createServer((req, res) => {
	console.log("Hi!");
	
	// this will only be activated once something is interacted w/ on DOM
	
	res.writeHead(200, {'Access-Control-Allow-Origin': '*'});
	
	console.log("HELLLOOOOO");
	
	const queryObject = querystring.parse(req.url,true).query;
	console.log('REQ URL ' + req.url);
	
	var strUrl = String(req.url);
	console.log("URL " + strUrl);
	
	const arrParams= strUrl.split("&");
	console.log(arrParams);

	type = arrParams[1].split("=")[1];
	console.log("TYPE " + type);

	if(type == 2){
		console.log("AUTO!!!!!");
	
		term = arrParams[2].split("=")[1];
		console.log("TERM " + term);
		long = arrParams[3].split("=")[1];
		console.log("LONG " + long);
		console.log("yeaaaahhh");
		lat = arrParams[4].split("=")[1];
		console.log("LAT " + lat);
		makeAutoYelpRequest(term, long, lat, res);
	}
	
	else{
		console.log("MANUAL!!!!!");
	
		term = arrParams[2].split("=")[1];
		console.log("TERM " + term);
		place = arrParams[3].split("=")[1];
		console.log("PLACE " + place);
		console.log("yeaaaahhh");
		makeYelpRequestManual(term, place, res);
	}
});
	
	
// 'unlocking door'
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});

	
	
