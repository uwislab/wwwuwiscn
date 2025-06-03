sudo docker run -d\
  -p 80:80\
  --restart=always\
  -v /home/ubuntu/myApp/www:/var/www/html\
  --name uwis-nginx-php\
  --network uwis-net\
  uwis-nginx-php
