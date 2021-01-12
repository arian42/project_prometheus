url='http://127.0.0.1:5000/api/sign-up'
json='{"email":"aryan4@example.com", "password":"12345678", "name":"aryan", "username":"aryan4"}'

url='http://127.0.0.1:5000/api/sign-in'
json='{"usernameOrEmail":"aryan", "password":"12345678"}'

url='http://127.0.0.1:5000/api/search'
json='{"username": "a"}'

url='http://127.0.0.1:5000/api/profile'


url='http://127.0.0.1:5000/api/chat/aryan3'
json='{"msg": "hellow"}'

token='x-access-token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZXhwIjoxNjEwNTU3NDIxfQ.CKJENUcocPdvehHiEGjbhriDHb9Wf0Ycl5OMotbk-r8'

curl -X POST -H "$token" -d "$json" $url
curl -H "$token" $url

