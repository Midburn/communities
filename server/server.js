const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const webpackConfig = require("../config/webpack.config.dev.js");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const compression = require('compression');
const constants = require('./models/constants');
const services = require('./services');
const routers = require('./routers');
const GenericResponse = require('./models/generic-response');
const Sequelize = require('sequelize');

class Server {

    constructor() {
        this.app = express();
        this.config = services.config;
        this.listener = null;
        this.initMiddlewares();
        this.initRouters();
        this.initStaticServer();
        this.initDatabase();
        this.handleGenericReposnse();
        if (this.config.isDevMode) {
            this.initWebpackDevServer();
        }
    }

    initMiddlewares() {
        this.app.use(function(req, res, next) {
            res.header('Access-Control-Allow-Credentials', true);
            res.header("Access-Control-Allow-Origin", req.headers.origin);
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        this.app.use(cookieParser());
        this.app.use(bodyParser.json()); // for parsing application/json
        this.app.use(compression()); // compress all responses
        this.app.use(async (req, res, next) => {
            if (req.url.includes(this.config.SPARK_HOST)) {
                next();
            }
            try {
                const token = req.cookies && req.cookies[this.config.JWT_KEY] && req.cookies[this.config.JWT_KEY].token;
                const userDetails = jwt.verify(token, this.config.SECRET);
                req.token = token;
                req.userDetails = userDetails;
                next();
            }
            catch (err) {
                if (req.path.startsWith('/api/v1/') && !req.path.startsWith('/api/v1/public/')) {
                    res.clearCookie(this.config.JWT_KEY);
                    return next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error('Unauthorized'), 401));
                } else {
                    next();
                }
            }
        });
    }

    initRouters() {
        this.app.use('/api', routers.v1.router);
    }

    initStaticServer() {
        this.app.use('/public', express.static(path.join(__dirname, '../public/')));
        this.app.use(express.static('public'));
        this.app.get('*', (req, res, next) => {
            if (req.path.startsWith('/api/') || req.path.startsWith('/public/')) {
                next();
            } else {
                return this.sendHTMLIndexFile(res);
            }
        });
    }

    initWebpackDevServer() {
        const compiler = webpack(webpackConfig);
        const server = new webpackDevServer(compiler, {
            hot: true,
            contentBase: path.join(__dirname, "..", "public"),
            compress: true,
            publicPath: "/",
            stats: false,
            proxy: {
                "/api": "http://localhost:8080",
                "/public": {
                    target: "http://localhost:3006",
                    pathRewrite: {"^/public": ""}
                }
            },
            historyApiFallback: {
                rewrites: [
                    {from: /^\/$/, to: '/index.html'}]
            }
        });
        server.listen(3006);
    }

    initDatabase() {
        const db_name = process.env.MYSQL_DB_NAME || 'dev_camps_arts';
        const sequelize = new Sequelize({
            dialect:    "mysql",
            host:       process.env.MYSQL_DB_HOST || 'localhost',
            port:       process.env.MYSQL_DB_PORT || '3306',
            username:   process.env.MYSQL_DB_USERNAME || 'root',
            password:   process.env.MYSQL_DB_PASSWORD || 'admin',
            database:   db_name,
            modelPaths: [path.join(__dirname + "/models")]
        });
        console.log('Attempting to connect to MYSQL DB: ', db_name)
        sequelize.authenticate()
        .then(() => {
            console.log('Sequelize MYSQL connection has been established successfully.');
        })
        .catch(err => {
            console.error('Sequelize error: unable to connect to the MYSQL database:', err);
        });
    }

    sendHTMLIndexFile(res) {
        return res.sendFile(path.join(__dirname, '../public/index.html'));
    }

    handleGenericReposnse() {
        this.app.use((genericResponse, req, res, next) => {
            if (res.ended || !genericResponse) {
                return;
            }
            switch (genericResponse.type) {
                case constants.RESPONSE_TYPES.STATIC:
                    return this.sendHTMLIndexFile(res);
                case constants.RESPONSE_TYPES.ERROR:
                case constants.RESPONSE_TYPES.JSON:
                    break;
                default:
                    genericResponse = new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error('Server Error - empty response sent to handler'));

            }
            return res.status(genericResponse.status).json(genericResponse);
        });
    }

    listen() {
        const that = this;
        this.listener = this.app.listen(this.config.PORT, function () {
            const host = that.listener.address().address;
            const port = that.listener.address().port;
            console.log("Listening at http://%s:%s", host, port);
            if (that.config.isDevMode) {
                console.log(`For debug go to http://localhost:3006`);
            }
        });
    }
}

new Server().listen();

