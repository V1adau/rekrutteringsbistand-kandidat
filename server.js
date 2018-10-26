/* eslint-disable no-param-reassign */
const express = require('express');
const proxy = require('express-http-proxy');
const helmet = require('helmet');
const path = require('path');
const mustacheExpress = require('mustache-express');
const fs = require('fs');
const Promise = require('promise');
const { isNullOrUndefined } = require('util');
const jwt = require('jsonwebtoken');

const currentDirectory = __dirname;

const server = express();
const port = process.env.PORT || 8080;

const isProd = process.env.NODE_ENV !== 'development';
const contextRoot = process.argv.length && process.argv[process.argv.length - 1] === 'pam-kandidatsok-next' ? 'pam-kandidatsok-next' : 'kandidater';
const appNavn = process.argv.length && process.argv[process.argv.length - 1] === 'pam-kandidatsok-next' ? 'pam-kandidatsok-next' : 'pam-kandidatsok';
const testtmp = process.argv;

server.set('port', port);

server.disable('x-powered-by');
server.use(helmet({ xssFilter: false }));
server.use(helmet({
    xssFilter: false,
    noCache: true
}));


if (isProd) {
    server.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'none'"],
            scriptSrc: [
                "'self'",
                'https://www.google-analytics.com',
                "'sha256-3ivVSOxwW5BHJHQdTkksJZIVc1FWOa3/VmxIvm60o2Y='" // sha'en er for at frontend-loggeren skal kunne kjøre som inline-script
            ],
            styleSrc: ["'self'"],
            fontSrc: ["'self'", 'data:'],
            imgSrc: ["'self'", 'data:', 'https://www.google-analytics.com'],
            connectSrc: ["'self'", 'https://www.google-analytics.com']
        }
    }));
}

const dirExists = (dir) => fs.existsSync(path.join(__dirname, dir));

const getViewsDir = () => {
    if (process.env.NODE_ENV === 'development' && dirExists('viewsDev')) {
        return 'viewsDev';
    }
    return 'views';
};

server.set('views', `${currentDirectory}/${getViewsDir()}`);
server.set('view engine', 'mustache');
server.engine('html', mustacheExpress());

const fasitProperties = {
    PAM_KANDIDATSOK_API_URL: `/${contextRoot}/rest/`,
    LOGIN_URL: process.env.LOGINSERVICE_URL,
    LOGOUT_URL: process.env.LOGOUTSERVICE_URL,
    PAMPORTAL_URL: process.env.PAMPORTAL_URL,
    BACKEND_OPPE: process.env.PAM_KANDIDATSOK_BACKEND_OPPE === 'true',
    API_GATEWAY: process.env.PAM_KANDIDATSOK_API_URL,
    PROXY_API_KEY: process.env.PAM_KANDIDATSOK_API_PROXY_API_APIKEY,
    USE_JANZZ: process.env.PAM_KANDIDATSOK_USE_JANZZ === 'true'
};

const writeEnvironmentVariablesToFile = () => {
    const fileContent =
        `window.__PAM_KANDIDATSOK_API_URL__="${fasitProperties.PAM_KANDIDATSOK_API_URL}";\n` +
        `window.__LOGIN_URL__="${fasitProperties.LOGIN_URL}";\n` +
        `window.__LOGOUT_URL__="${fasitProperties.LOGOUT_URL}";\n` +
        `window.__PAMPORTAL_URL__="${fasitProperties.PAMPORTAL_URL}";\n` +
        `window.__BACKEND_OPPE__=${fasitProperties.BACKEND_OPPE};\n` +
        `window.__USE_JANZZ__=${fasitProperties.USE_JANZZ};\n` +
        `window.__CONTEXT_ROOT__="${contextRoot}";\n`;

    fs.writeFile(path.resolve(__dirname, 'dist/js/env.js'), fileContent, (err) => {
        if (err) throw err;
    });
};

const renderSok = () => (
    new Promise((resolve, reject) => {
        server.render(
            contextRoot === 'pam-kandidatsok-next' ? 'index-next.html' : 'index.html',
            fasitProperties,
            (err, html) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(html);
                }
            }
        );
    })
);


const normalizedTokenExpiration = (token) => {
    const expiration = jwt.decode(token).exp;
    if (expiration.toString().length === 10) {
        return expiration * 1000;
    }
    return expiration;
};

const unsafeTokenIsExpired = (token) => {
    if (token) {
        const normalizedExpirationTime = normalizedTokenExpiration(token);
        return normalizedExpirationTime - Date.now() < 0;
    }
    return true;
};

const extractTokenFromCookie = (cookie) => {
    if (cookie !== undefined) {
        const token = cookie.split(';').filter((s) => s && s.indexOf('-idtoken') !== -1).pop();
        if (token) {
            return token.split('=').pop().trim();
        }
    }
    return null;
};

const tokenValidator = (req, res, next) => {
    const token = extractTokenFromCookie(req.headers.cookie);
    if (isNullOrUndefined(token) || unsafeTokenIsExpired(token)) {
        const protocol = isProd ? 'https' : req.protocol; // produksjon får også inn http, så må tvinge https der
        const redirectUrl = `${fasitProperties.LOGIN_URL}&redirect=${protocol}://${req.get('host')}/${contextRoot}`;
        return res.redirect(redirectUrl);
    }
    return next();
};

const urlHost = (miljo) => {
    if (miljo.toUpperCase() === 'Q0') {
        return 'https://arbeidsplassen-q.nav.no';
    } else if (miljo.toUpperCase() === 'Q6') {
        return 'https://arbeidsplassen-t.nav.no';
    }
    return 'https://arbeidsplassen.nav.no';
};

const startServer = (html) => {
    writeEnvironmentVariablesToFile();

    server.get(`/${appNavn}/internal/isAlive`, (req, res) => res.sendStatus(200));
    server.get(`/${appNavn}/internal/isReady`, (req, res) => res.sendStatus(200));

    const proxyHost = fasitProperties.API_GATEWAY.split('://').pop().split('/')[0];

    server.use(`/${contextRoot}/rest/`, proxy(proxyHost, {
        https: true,
        proxyReqPathResolver: (req) => (
            req.originalUrl.replace(new RegExp(contextRoot), 'pam-kandidatsok-api/pam-kandidatsok-api')
        ),
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            if (srcReq.headers.cookie !== undefined) {
                const token = srcReq.headers.cookie.split(';').filter((s) => s && s.indexOf('selvbetjening-idtoken') !== -1).pop();
                if (token) {
                    proxyReqOpts.headers.authorization = `Bearer ${token.split('=').pop().trim()}`;
                }
            }
            proxyReqOpts.headers['x-nav-apiKey'] = fasitProperties.PROXY_API_KEY;
            return proxyReqOpts;
        }
    }));

    server.use(
        `/${contextRoot}/js`,
        express.static(path.resolve(__dirname, 'dist/js'))
    );
    server.use(
        `/${contextRoot}/css`,
        express.static(path.resolve(__dirname, 'dist/css'))
    );

    server.get(
        [`/${contextRoot}`, `/${contextRoot}/*`],
        tokenValidator,
        (req, res) => {
            res.send(html);
        }
    );

    server.get(
        ['/pam-kandidatsok', '/pam-kandidatsok/*'],
        (req, res) => {
            const host = urlHost(process.env.FASIT_ENVIRONMENT_NAME);
            const urlPath = req.url.split('pam-kandidatsok')[1];
            res.redirect(`${host}/kandidater${urlPath}`);
        }
    );

    server.listen(port, () => {
        console.log(`Express-server startet. Server filer fra ./dist/ til localhost:${port}/ contextRoot:${contextRoot} test: ${testtmp}`);
    });
};

const logError = (errorMessage, details) => console.log(errorMessage, details);

renderSok()
    .then(startServer)
    .catch((error) => logError('Failed to render app', error));
