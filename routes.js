const routes = require('next-routes')();

routes
    .add('/lottery/list', '/lottery/List')
    .add('/lottery/details/:address', '/lottery/Show')
    .add('/lottery/new', '/lottery/New')
    .add('/lottery/participate/:address', '/lottery/Participate')
    ;

module.exports = routes;