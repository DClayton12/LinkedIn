/*
 * Darnel Clayton
 * 7/8/2015
 * Description: User input is gathered from html search form.
 * User query is formatted and used while contacting Google's Custom Search API.
 * JSON response from Google is parsed to extract absolute LinkedIn profile URL's.
 * Collected profile URL's are storred in an array and each link is used to make a call to 
 * LinkedIn's API to request data on the given profile.
 * iRequested LinkedIn profile in JSON format is appeneded to html page along with status messages.
 * Using AJAX,the JSON string is sent to write_profile.php.
 * The PHP page is responsible for writing to a plain-text file and appends the 
 * number of bytes written and unique file name to the html page.
 */

function onLinkedInLoad(){

    IN.Event.on(IN, "auth", ready); // Calls linkedin login to appear in new window.
					     // If a linkedin session is active a window will now appear and onLinkedInAuth() is immediately called.
}

function ready(){

    console.log("Ready to gather LinkedIn profile information");
}

function gatherInput(){

	var fname = document.getElementById('fname').value;
	
	fname = fname.replace(/\s+/g, '+');
	
	console.log("First name input: " + fname);
	
	var lname = document.getElementById('lname').value;
	
	lname = lname.replace(/\s+/g, '+');
	
	console.log("Last name input: " + lname);

    var userQuery = document.getElementById('userQuery').value;  //Collect user input from search bar.
	
	userQuery = userQuery.replace(/\s+/g, '+');
	
	console.log("Extra parameters input: " + userQuery);

	var totalInput = fname + "+" + lname + '+' + userQuery;
    
	if(fname == "First+Name..." && lname == "Last+Name..." && userQuery == "Search+LinkedIn..." || 
		fname== "" && lname == "" && userQuery == ""){	// If and only if form is unchanged or blank submit query on user who is logged in.

        alert("No input received. Searching profile of logged in user.");
		
		totalInput = "";

        onLinkedInAuth("me");

        ready();

    }

    fixUserInput(totalInput);

}

function fixUserInput(totalInput){
	
	console.log("Concatenated input: " + totalInput);
	
	var fixedInput = totalInput.replace(/\s+/g, '+'); 	//http://web-design-lessons.com/articles/article/1/Javascript%20Replace%20All%20Instances%20In%20a%20String

	console.log("Replaced whitespace with '+' " + fixedInput);
	
    var customSearchStr = "https://www.googleapis.com/customsearch/v1?key=AIzaSyCf2GppoXDjGorxucF2wtlomiB2j9Yy_SQ&cx=006724625907300947303:fzfujafkfwq&q=";
    //Call to Google's REST API. Includes my API key and Custom Search Engine ID.

    customSearchStr += fixedInput; //Concat fname to api call.

    console.log("Call to Google's Custom Search API: " + customSearchStr); // I would like to view the string and paste it into POSTMAN so I may view that is correct.

    contactGoogle(customSearchStr); // Call to make the HTTP request to Google's REST API.
}

var HttpClient = function(){ 

    this.get = function(aUrl, aCallback){

    var anHttpRequest = new XMLHttpRequest();

    anHttpRequest.onreadystatechange = function(){ 

    if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200){

	aCallback(anHttpRequest.responseText); }

    }

        anHttpRequest.open("GET", aUrl, true);            

        anHttpRequest.send(null);
    }
}

function contactGoogle(custom_search){

    var myGoogleRequest = new HttpClient();

    myGoogleRequest.get(custom_search , function(response){
   
    console.log(response);	//Uncomment to analyze raw JSON response from Google Custom search API.

    var google_result = JSON.parse(response);
 
    var profileArray = google_result.items;

    for (var count in profileArray){

		var resulting_profile = "url=";

        console.log(resulting_profile += profileArray[count].link);
 
	onLinkedInAuth(google_result.items[count].link);
    }
 
    });

}
    
function onLinkedInAuth(user_defined_profile) { // It is possible to request profile data for user who logs in or any profile using absolute URL.

    console.log("Compiled format of user profile: " + user_defined_profile);

    IN.API.Profile(user_defined_profile)
    .fields("email-address","picture-url","picture-urls::(original)","num-connections","id","current-share","firstName", "lastName", "industry","headline", "skills", "educations","summary","positions","specialties","location")
    .result(displayProfiles); 
}

function displayProfiles(profiles) {
    
    var profilesDiv = document.getElementById("profiles"); // Grab empty div by ID. I will use this to append profile data to the page.

    var members = profiles.values; 	// Linkedin returns an array with X number of profiles within.

    profilesDiv.innerHTML += "<p><b> LinkedIn Profiles received. </b></p>";	// Status message.

    console.log("Array length should be 1. CHECK --> " + members.length);    // Array must contain 1 element. 
																			//For loop in google_custom_search_engine() controls flow to linkedIn API.

	var fname = document.getElementById('fname').value;
	
	//console.log("First name input: " + fname);
	
	var lname = document.getElementById('lname').value;
	
	//console.log("Last name input: " + lname);

	var curr_profile = JSON.stringify(members[0]); 	// Convert JS profile object to JSON. Use to deference profile fields.
	
	if(fname.toUpperCase() == members[0].firstName.toUpperCase() && lname.toUpperCase() == members[0].lastName.toUpperCase() || 
			fname == "First Name..." && lname == "Last Name..." || 
			fname== "" && lname == "") { 
	//Only capture and display profiles that the user explicity searched for by first and last name.
        if(members[0].pictureUrls._total != 0){ //If and only if a LinkedIn member has a photo display it and log it to the console.
			
			console.log(members[0].firstName + " " + members[0].lastName + "\'s photoURL --> " + members[0].pictureUrls.values[0]);
			
			profilesDiv.innerHTML += "<p><br>  <img src='"  + members[0].pictureUrls.values[0] + "'/>"; 
			
		}

		profilesDiv.innerHTML += "<p><b>Requested LinkedIn Profile in JSON format:</b></p>" + curr_profile; // Writing JSON to document for inspeciton
		
	}
	
    /* $.post('write_profile.php', curr_profile, function(data){  //UNcomment to enable 

  	$('#response').html(data);

	}).fail(function() {

		alert( "Posting to PHP File failed." );

	});
  
    profilesDiv.innerHTML += "<p><b>POST rquest sent to PHP page.</b></p>"; */
}
