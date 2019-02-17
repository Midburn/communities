[![Build Status](https://travis-ci.org/Midburn/communities.svg?branch=master)](https://travis-ci.org/Midburn/communities)

## Prerequisites

### Node.JS
You should have Node.JS ver. 10+ installed ([NVM](https://github.com/creationix/nvm)/[NVM Windows](https://github.com/coreybutler/nvm-windows) is recommended)
### MySQL
You should have MySQL Server ver. 5.6/5.7 (Important!) installed and running.
#### Make sure to run `npm run createdb` in order to set up a new local db for development
### Spark
This application uses [Spark](https://github.com/midburn/spark) as parent application and logging in is done through spark.

#### you must have a running Spark ENV for logging in and cookie usage.

## Installation
### `npm install`

## Development
### Make sure to create a local `.env` file (see `.env.example` file)
### Migrate db schema using `npm run migrate`
### Run `npm start:dev`

Runs the app in the development mode.<br>
Open [http://localhost:3006](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.
## Testing
### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.


## Building
### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Running in production
### `npm start`
Will run the service in production mode (Make sure to have all correct env variables (see `.env.example`)
## Features

- Translation using [react-i18next](https://github.com/i18next/react-i18next)
- View components using [MDBootstrap](https://mdbootstrap.com)
