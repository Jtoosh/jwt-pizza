host=https://pizza.jtdevops.click/

# curl $host | jq

version=${host}version.json

curl -s $version | jq
