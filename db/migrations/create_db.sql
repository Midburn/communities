DROP DATABASE IF EXISTS theme_and_arts;

# Implicitly create the user and then drop the user.
GRANT USAGE ON *.* TO 'theme'@'localhost' IDENTIFIED BY 'password';
DROP USER 'theme'@'localhost';
flush privileges;

CREATE DATABASE IF NOT EXISTS theme_and_arts;

ALTER DATABASE theme_and_arts CHARACTER SET utf8;
ALTER DATABASE theme_and_arts COLLATE utf8_general_ci;

CREATE USER 'theme'@'localhost'
  IDENTIFIED BY 'theme';

GRANT ALL ON theme.* TO 'theme'@'localhost';
