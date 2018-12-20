const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const webpackConfig = require("../webpack.config.js");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const compression = require('compression');
const constants = require('./models/constants');
const services = require('./services');
const routers = require('routers');

class Server {

    constructor() {
        this.app = express();
        this.config = services.config;
        this.listener = null;
        this.initMiddlewares();
        this.initRouters();
        this.initStaticServer();
        this.handleGenericReposnse();
        if (this.config.isDevMode) {
            this.initWebpackDevServer();
        }
    }

    initMiddlewares() {
        this.app.use(cookieParser());
        this.app.use(bodyParser.json()); // for parsing application/json
        this.app.use(compression()); // compress all responses
        this.app.use(async (req, res, next) => {
            if (req.path === '/api/v1/login') {
                return next();
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
                    console.log(err);
                    res.clearCookie(this.config.JWT_KEY);
                    return res.redirect(this.config.SPARK_HOST);
                } else {
                    next();
                }
            }
        });
    }

    initRouters() {
        this.app.use('api', routers.v1.router);
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
                },
                "/login": "http://localhost:8080/api/v1"
            },
            historyApiFallback: {
                rewrites: [
                    {from: /^\/$/, to: '/index.html'}]
            }
        });
        server.listen(3006);
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
                    genericResponse = new genericResponse(constants.RESPONSE_TYPES.ERROR, new Error('Server Error - empty response sent to handler'));

            }
            return res.status(genericResponse.status).json(genericResponse);
        });
    }

    listen() {
        this.listener = this.app.listen(this.config.PORT, function () {
            const host = this.listener.address().address;
            const port = this.listener.address().port;
            console.log("Listening at http://%s:%s", host, port);
            if (this.config.isDevMode) {
                console.log(`For debug go to http://localhost:9090/login`);
            }
        });
    }
}

new Server().listen();

