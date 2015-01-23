START_TIME=$SECONDS
apt-get update
apt-get upgrade -y
# -- Locales
locale-gen en_US en_US.UTF-8
locale-gen fr_BE fr_BE.UTF-8
dpkg-reconfigure locales
# -- MongoDB
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | tee /etc/apt/sources.list.d/mongodb.list
apt-get update
apt-get install -y mongodb-10gen
mongo admin --eval "db.addUser( { user: \"admin\", pwd: \"admin\", roles: [ \"userAdmin\" ] } )"
mongoimport -d chech-lajan -c banks --file /vagrant/_dev/banks.json
mongoimport -d chech-lajan -c terminals --file /vagrant/_dev/terminals.json
# -- NODE
add-apt-repository ppa:chris-lea/node.js
apt-get update
apt-get install -y nodejs
npm install -g n --unsafe-perm
n stable
# --- npm packages
npm install -g grunt-cli --unsafe-perm
# -- NGINX
apt-get install -y nginx-extras
echo "events {
  worker_connections 768;
}
http {
  sendfile off;
  tcp_nopush on;
  tcp_nodelay on;
  keepalive_timeout 65;
  types_hash_max_size 2048;

  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  client_max_body_size 400M;

  access_log /var/log/nginx/access.log;
  error_log /var/log/nginx/error.log;

  gzip on;
  upload_progress uploads 5m;

  include /etc/nginx/conf.d/*.conf;
  include /etc/nginx/sites-enabled/*;
}
" > /etc/nginx/nginx.conf
echo "server {
  listen 80;

  access_log /var/log/nginx/chech-lajan.lan;

  charset utf-8;

  location / {
    proxy_pass http://127.0.0.1:34567;
    proxy_redirect off;
    proxy_http_version 1.1;
    proxy_set_header Host \$http_host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto  \$scheme;
    proxy_set_header X-NginX-Proxy  true;
  }
}
" > /etc/nginx/sites-available/default
echo "

alias c='clear'
alias tree=\"find . | sed 's/[^/]*\//|   /g;s/| *\([^| ]\)/+--- \1/'\"
alias l='ls -Falh'
alias duh='du -h --max-depth=1'

alias rm='rm -I'
alias ..='cd ..'
alias ...='cd ~-'

cd /vagrant
" >> /home/vagrant/.bashrc
service nginx configtest
service nginx restart
# -- PROJECT DEPLOY
cd /vagrant
rm -rf node_modules
npm install --unsafe-perm --no-bin-links
# -- END
ELAPSED_TIME=$(($SECONDS - $START_TIME))
clear
echo "------------------------"
echo "----- Deploy ended -----"
echo "------------------------"
echo "Duration : $(($ELAPSED_TIME/60)) min $(($ELAPSED_TIME%60)) sec"
service nginx status
echo "-- node `node --version`"
echo "-- npm v`npm --version`"
echo "------------------------"
