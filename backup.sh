#!/bin/bash

docker exec trusted-setup-server_mysql_1 sh -c 'mysqldump -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE > /var/lib/mysql/backup_dump.sql'
docker cp trusted-setup-server_mysql_1:/var/lib/mysql/backup_dump.sql /tmp/
scp /tmp/backup_dump.sql ip.tornado.cash:/root

