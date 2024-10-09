# Chech is server is running and responds
GET http://localhost:8000
HTTP 200
[Asserts]
{"test":"successful"}

GET http://localhost:8000/queue
HTTP 200

GET http://localhost:8000/monitor
HTTP 200
[Asserts]
{"monitoring_status":"active"}


# Test fetching history with a contract address
GET http://localhost:8000/fetch-history?contractAddress=0x470f3b37B9B20E13b0A2a5965Df6bD3f9640DFB4&Denom=testdenom
HTTP/1.1 200
