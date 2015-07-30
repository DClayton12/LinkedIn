Darnel Clayton
www.linkedin.com/in/dclayton12
7/2015

TECHNOLOGIES: 
	Google Custom Search API, LinkedIn API, JQuery, AJAX, and PHP.

USECASE: 
	1.Collect LinkedIn profiles in standard format to match and merge with existing contact and customer records in database and indexed in solr.

	2. Embed this web application into user interface. As a user authenticates with	
LinkedIn we may collect this data to extend user profiles. For example,We may learn about the user's
skills, connections, education and employment history. This application will be very 
useful because the user will not have to spend the time inputing this information.
Data will be useful as we do not assume or rely on users inputting profile information accurately.

USAGE: 
	User must autehenticate with LinkedIn to create an active session with LinkedIn by logging in with their LinkedIn credentials. Search for LinkedIn members by first name, last name, and any extra parameters you know about this person. Extra parameters such as workplace and education details are best. LinkedIn profiles in JSON format and profile images are appended to the page. Lastly, the appended profiles are written to plain text files. The number of bytes written and file names are also appended to the user.

Performance: 
	The HTML form reads in data and triggers gatherInfor() upon submission. User input is gathered by HTML ID and concatenated. Whitespace is removed and replaced with '+'. An example of fixed input is: 'Darnel+Clayton+Computer+Science'. This newly generated string is used to make a restful call to Google's Custom Search API. A response is returned in JSON format. I parse this to collect only absolute URL's of LinkedIn profiles. LinkedIn are typically in the form with www.linkedin.com/in/userName or www.linkedin.com/pub/userName.

	Collected absolute URL's collected are stored in an array. A loop is used to control flow and make
calls to LinkedIn's API to request public profile information using the URL as a parameter.
All profile fields are requested. However, only basic profile fields will be returnd. (Please see Notes.)
Status messages and LinkedIn profiles in JSON format are appended to the page. Using AJAX,
The JSON string is pushed to the PHP page (write_profile.php). I use PHP to write strings to plaintext files.
Number of bytes written and file names are also appended to the user. To ensure filenames are unique,
I count the number of files in the current directory and concat this integer to a string which will
serve as a unique file name.

Notes: 
	My client ID registed with LinkedIn is only permitted to retrieve basic profile fields(https://developer.linkedin.com/docs/fields/basic-profile). Although, all fields are requested, items such as 'Educations', 'Skills', and 'Associations' require full profile permission and therefore are simply not returned.
