# T1-Distribuida

curl --location --request POST 'http://0.0.0.0:8080/api/gatekeeper/submit' \
--header 'Content-Type: application/json' \
--data-raw '{
    "data": {
        "Owner": "a",
        "Color": "b",
        "Size": 1
    }
}'

curl --location --request POST 'http://0.0.0.0:8080/api/gatekeeper/read/getAllMarbles'
