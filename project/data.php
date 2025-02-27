<?php

// Initialize cURL session
$ch = curl_init();

// Set the URL
curl_setopt($ch, CURLOPT_URL, 'https://api.baubuddy.de/index.php/login');

// Set the HTTP request method to POST
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');

// Set the request headers
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Basic QVBJX0V4cGxvcmVyOjEyMzQ1NmlzQUxhbWVQYXNz',
    'Content-Type: application/json'
]);

// Set the POST data
$data = json_encode([
    'username' => '365',
    'password' => '1'
]);

curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

// Return the response instead of outputting it directly
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Execute the cURL request
$response = curl_exec($ch);

// Check for errors
if ($response === false) {
    echo 'cURL Error: ' . curl_error($ch);
} else {
    // Output the response
    $data = json_decode($response, true);
    if (isset($data['oauth']['access_token'])) {
        $access_token = $data['oauth']['access_token'];
    } else {
        echo "Access token not found!";
        exit;
    }
}

// Close the cURL session
curl_close($ch);

//------------------------------------------------------------------------------------------------------------------------//

// Initialize cURL session
$ch_2 = curl_init();

// Update the error check to:
if (curl_errno($ch_2)) {
    echo "cURL Error: " . curl_error($ch_2);
}

// The API endpoint you want to query
$url = "https://api.baubuddy.de/dev/index.php/v1/tasks/select";  // Replace with your actual API endpoint

// Set the cURL options
curl_setopt($ch_2, CURLOPT_URL, $url);  // The URL to request
curl_setopt($ch_2, CURLOPT_RETURNTRANSFER, true);  // Return the response as a string
curl_setopt($ch_2, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $access_token"  // Authorization header with Bearer token
]);

// Execute the cURL request and capture the response
$response_2 = curl_exec($ch_2);

// Check for errors
if (curl_errno($ch_2)) {
    echo "cURL Error: " . curl_error($ch_2);
} else {
    // Process the response_2 (e.g., parse JSON)
    $data = json_decode($response_2, true);  // Decode the JSON response_2 to an associative array
    if ($data === null) {
        echo "Failed to decode JSON response.";
        exit;
    } else {
        // var_dump($data);  // Output the response_2 data (you can format this as needed)
    }
}

// Close the cURL session
curl_close($ch_2);

// Return the data as a JSON response_2
header('Content-Type: application/json');
if (isset($data)) {
    echo json_encode($data); // string
} else {
    echo "No data available!";
}

?>
