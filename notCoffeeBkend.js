		const http = require('http');
const url = require('url');
const hostname = 'localhost';
//const express = require('express');
//const app = express();

const port = 6000;
// backend at location/not-coffee

// this one node script (port 7000) gets all of the users' requests
// all make sep queries
// but use same/share db connection

// TO DO: May need to choose a new port ***

var mysql = require('mysql');
var request = require('request'); // req lib that lets you make reqs
var querystring = require('querystring'); // queries in the URL

//connection object, could name this anything
// can keep this the same as cryptoLlama
function createDBConnection(){
	var connection = mysql.createConnection({
		  host: "localhost",
		  user: "sqlbabka",
		  password: "sqlbabka"
		});
	return connection;
}


// FUNCTION FOR ADDING A USER (with phone number)
function addUser(responseToGenerate, userInfo){
	console.log("addUser Node.js script & DB connection");
	
	var con = createDBConnection();
	
	console.log("USER INFO IS: " + userInfo);
	
	con.connect(function(err) {
		
		if(err) throw err;
		console.log("Connected");


		sql = "INSERT INTO notCoffee.notCoffeeUsers (contactType, status, contactInfo) VALUES ('phoneNumber', 'active', '" + userInfo + "')";
		
		console.log(sql);
		
		con.query(sql, function (err, result) {
			if (err) {
				console.log(err);
				console.log("The error is: " + err.code);
				
				// adding status: 200 when the error came back (whether the success is T or F)
				if(err.code == "ER_DUP_ENTRY"){
					
					// use 200 because the 'waiter' still comes back
					result = {status: 200, success: false, 
						info: 
						{errCode: err.code, error_info: "Duplicate. Record already exists in DB."} 
					};
				}
				else{
					result = {status: 200, success: false, 
						info: {errCode: err.code, error_info: "DB related error."} 
					};
				}
				
				console.log("The STATUS is: " + result.status + ", the SUCCESS IS: " + 
				result.success + " AND " + result.info.errCode);
				// either way
			}

			else{
				// SUCCESS, no DB issues
				result = {status: 200, success: true, 
					info: 
					{userInfofINS: userInfo}
				};
				// send message when adding alert is successful
				console.log("HELLO B4 ADDED!!!");
				sendMessage(userInfo, "added");
			
			}
			
			responseToGenerate.end(JSON.stringify(result));
		
		con.end();
		
		});
	});
}


function sendMessage(userContact, action){
	console.log("SEND MESSAGE ******");
	console.log(userContact);
	console.log(action);

	//logger.info("Successfully " + action + " " + currencyCode + " alert to " + userContact);
	const accountSid = 'AC59893af527c77dd09f38aae9976d164d';
	const authToken = '81b9e4a653df64314b0cd66ff91eab0c';
	const client = require('twilio')(accountSid, authToken);
	  
	  client.messages
		.create({
		   body: "Successfully " + action + " " + userContact,
		   from: '+16105508665', // Twilio number
		   to: userContact // my Google voice num
		   
		   // NOTE:
		   // the to should be userContact SMS (not email)
		 })
		.then(message => console.log("HI " + message.sid));
}

// FOR SERVER:
const server = http.createServer((req, res) => {
	
	// QUERY PARAM STUFF FOR BASE URL FROM BEFORE
	const queryObject = querystring.parse(req.url,true).query;
	console.log(req.url);
	var strUrl = String(req.url);
	console.log(strUrl);
	
	
	const arrParams= strUrl.split("?");
	console.log("hi");
	
	var coinParams = arrParams.slice(1,2);
	console.log("coinParams TWO " + coinParams); // all good, just removing https:IPADDRESS

	var final_elems = []
	
	coinParams.forEach(element => 
	  final_elems.push(element.split("=")));
	  
	console.log("three");  
	  
	console.log("FINAL ELEMS " + final_elems);
	var action = (final_elems[0][1].split("&"))[0]
	var phoneNum = (final_elems[0][2])
	console.log("ACTION: " + action);
	console.log("NUM: " + phoneNum);
	
	if(action == "addUserAlert"){
		//MA added May 6th
		console.log("Inside the AddUserAlert function");
		console.log("PHONE NUM: " + phoneNum);
		addUser(res, phoneNum);
		// sendMessage(currencyCode, userInfo, "added");
	}
		
});

// AT END:
// aka 'unlocking door'
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});