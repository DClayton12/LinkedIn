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

    console.log("Ready to gather linkedin profile information");
}

function gatherInput(){

    var userQuery = document.getElementById('userQuery').value;  //Collect user input from search bar.

    if(userQuery == "" || userQuery == "Search LinkedIn..." ){	// If form is unchanged or blank submit query on user who is logged in.

        alert("No input received. Searching profile of logged in user.");

        onLinkedInAuth("me");

        ready();

    }

    fixUserInput(userQuery);

}

function fixUserInput(userQuery){

    var fixedInput = userQuery.replace(/\s+/g, '+'); 	//http://web-design-lessons.com/articles/article/1/Javascript%20Replace%20All%20Instances%20In%20a%20String

    console.log("User input is: " + userQuery);

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
   
   // console.log(response);	//Uncomment to analyze raw JSON response from Google Custom search API.

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
    .fields("email-address","picture-urls::(original)","num-connections","id","current-share","firstName", "lastName", "industry","headline", "skills", "educations","summary","positions","specialties","location")
    .result(displayProfiles); 
}

function displayProfiles(profiles) {
    
    var profilesDiv = document.getElementById("profiles"); // Grab empty div by ID. I will use this to append profile data to the page.

    var members = profiles.values; 	// Linkedin returns an array with X number of profiles within.

    profilesDiv.innerHTML += "<p><b> LinkedIn Profiles received. </b></p>";	// Status message.

    console.log("Array length should be 1. CHECK --> " + members.length);    // Array must contain 1 element. 
						       //For loop in google_custom_search_engine() controls flow to linkedIn API.

    var curr_profile = JSON.stringify(members[0]); 	// Convert JS profile object to JSON. Use to deference profile fields.

    profilesDiv.innerHTML += "<p><b>Requested LinkedIn Profile in JSON format:</b></p>" + curr_profile; // Writing JSON to document for inspeciton

    $.post('write_profile.php', curr_profile, function(data){

  	$('#response').html(data);

	}).fail(function() {

	alert( "Posting to PHP File failed." );

	});
  
    profilesDiv.innerHTML += "<p><b>POST rquest sent to PHP page.</b></p>";
           
/*    profilesDiv.innerHTML += "<p><b>Displaying LinkedIn profile data for readability.</b></p>";
    for (var member in members){

    if(members[member].pictureUrls._total != 0){
        $profilesDiv.innerHTML += "<p> " +
	"<br><br>  <img src='"  + members[member].pictureUrls.values[0] + "'>"; }
    
        profilesDiv.innerHTML += "<p> " +	
	"<br><br>  Member's LinkedIn ID:	  " + members[member].id  + //No conditional, linkedin requires name and email, ID is generated.
	"<br><br>  Member's first_name:  		 " + members[member].firstName + 
	"<br><br>  Member's last_name:   		 " + members[member].lastName +
	"<br><br>  Member's email address:             " + members[member].emailAddress +
	"<br><br>  Member's headline:   	" + members[member].headline +
        "<br><br>  Member's work industry:  	 " + members[member].industry +
	"<br><br>  Member's profile summary:		" + members[member].summary  +
	"<br><br>  Member's location:  		" + members[member].location.name  +
	"<br><br>  Member's Country:           " + members[member].location.country.code + 
	"<br><br>  Member's most-recent status:  	" + members[member].currentShare.comment  +
	"<br><br>  Member's number of linkedin connections:           " + members[member].numConnections;

    if(members[member].positions._total != 0){
        profilesDiv.innerHTML += "<p> " +	
	"<br><br>  Member's most recent position:           " + members[member].positions.values[0].title +
	"<br><br>  Member's most recent employer:           " + members[member].positions.values[0].company.name +
	"<br><br>  Member currently working here?:           " + members[member].positions.values[0].isCurrent +
	"<br><br>  Employer industry:		           " + members[member].positions.values[0].company.industry +
	"<br><br>  Company size:                      " + members[member].positions.values[0].company.size +
	"<br><br>  Company type:                      " + members[member].positions.values[0].company.type +
	"<br><br>  Start date of member at " + members[member].positions.values[0].company.name +
	":			"  + members[member].positions.values[0].startDate.month + 
	"/" + members[member].positions.values[0].startDate.year +
	"<br><br>  Member's work summary:           " + members[member].positions.values[0].summary + 
	"<br><br>  [NO ACCESS TO FULL PROFILE] Member's skills:		 " + members[member].skills;
	}*/

/*Fields below are not returned from LinkedIn API. Permission needed to access "r_full_profile".
Please see this document for further info and application for permission:
https://developer.linkedin.com/support/developer-program-transition
https://developer.linkedin.com/docs/apply-with-linkedin
 
	"<br> [NO ACCESS TO FULL PROFILE] Member's education " +  members[member]["educations"]["values"][0]["schoolName"];  
	"<br> [NO ACCESS TO FULL PROFILE] MEMBER SKILLSS HERE " +  members[member].skills.values[0].skill.name;
	}
*/

/*
  Alternate method to post JSON to php page.
  var curr_profile = JSON.stringify(members[0]);

    $.ajax({
            type: "POST",
            dataType: "json",
            url: "write_profile.php",
            data: {myData:curr_profile},
            contentType: "application/json; charset=utf-8",
            success: function(data){
                alert('Profile data sent to be written.');
            },
            error: function(e){
                console.log(e.message);
            }
    });*/
}
