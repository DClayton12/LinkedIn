<?php

/* Darnel Clayton
 * 7/14/2015
 * Description: PHP page serves to write gathered linkedin profile in JSON format to a plaintext outputfile.
 * Number of bytes successfully written and the unique file name are appended to the HTML page.
 * To ensure file names are unique, the number of files in the current directory are counted.
 * The file count value is concatenated to the file name with the file extension to ensure they are unique.
 */

    echo "<pre>";
    //	print_r($_POST); // UNcomment to return exact response to original HTML page. 
    echo "</pre>";

    //Read in JSON from post
    $input = file_get_contents('php://input');

    //http://stackoverflow.com/questions/12249358/posting-json-to-php-script
    $jsonData = json_encode($input);

    //I am counting the # of files in the current dir. This number will be appended to the filename to ensure file are not overwritten.
    $file_count = new FilesystemIterator(__DIR__, FilesystemIterator::SKIP_DOTS);
    
    //printf("NUMBER OF FILES IN THE CURRENT DIR IS:  %d Files", iterator_count($file_count)); //Uncomment to display number of files to the user.

    $LinkedinOutput = 'curr_profile' . (iterator_count($file_count)+1) . '.txt'; // Concat file with unique identifier and file extension.

    //echo "<br> FILE NAME IS: $LinkedinOutput "; //File name is concatted with number of files in the directory.
    

    //Write string to output
    echo "<b>File write successful!</b> <br>"; 
				
				//file_put_contents() function opens <file>, writes to <file>, and closes <file>.
				//http://php.net/manual/en/function.file-put-contents.php
				//This function returns the number of bytes successfully written.
    echo "<b>Number of bytes written to '$LinkedinOutput' =  </b>",file_put_contents($LinkedinOutput,$jsonData);

?>
