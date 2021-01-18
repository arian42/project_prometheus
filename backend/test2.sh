#url='http://127.0.0.1:5000/api/sign-up'
#json='{"email":"ali@example.com", "password":"12345678", "name":"ali", "username":"ali"}'
#
#url='http://127.0.0.1:5000/api/sign-in'
#json='{"usernameOrEmail":"ali", "password":"12345678"}'
#
#url='http://127.0.0.1:5000/api/search'
#json='{"username": "a"}'
#
url='http://127.0.0.1:5000/api/profile'
#
#
#url='http://127.0.0.1:5000/api/chat/aryan'
#json='{"msg": "ME?"}'
#

#url='http://127.0.0.1:5000/api/chat/ali'
#json='{"msg": "hellow"}'

#url='http://localhost:5000/api/chats'

#Aryan TOKEN>>>
#token='x-access-token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MjU2ODQwNTQ3MiwiZXhwIjoxNjEwODIyNjM3fQ.rSU7toRTbvPqco5lVZjOI2quJtsmSnsG_TuRaimMdgY'

#ALI token>>>
token='x-access-token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NDIwOTY5NjcwLCJleHAiOjE2MTEwODA4NjN9.CYrWi3_c72nOYsZ983eN9iG9mb9R1OkH0peUSWu89Gg'

#curl -X POST -H "$token" -d "$json" $url
curl -H "$token" $url
#curl -d "$json" $url
#curl -X POST -H "Content-Type: multipart/form-data"  -H "$token" -F "file=@../../default.png" http://127.0.0.1:5000/api/profile