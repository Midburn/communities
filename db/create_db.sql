DROP DATABASE IF EXISTS communities;

# Implicitly create the user and then drop the user.
GRANT USAGE ON *.* TO 'theme'@'localhost' IDENTIFIED BY 'password';
DROP USER 'theme'@'localhost';
flush privileges;

CREATE DATABASE IF NOT EXISTS communities;

ALTER DATABASE communities CHARACTER SET utf8mb4;
ALTER DATABASE communities COLLATE utf8mb4_general_ci;

CREATE USER 'theme'@'localhost'
  IDENTIFIED BY 'theme';

GRANT ALL ON theme.* TO 'theme'@'localhost';
