#!/bin/bash
docker stop comment
docker rm comment
docker images -a | grep "comment" | awk '{print $3}' | xargs docker rmi
docker build -t comment .
docker images
docker run --name comment --env-file .env -p 5000:5000 -d  comment
docker ps -a
