const congViecRouter = require('./CongViec');

function route(app) {
    app.use('/api/congViec', congViecRouter);
}

module.exports = route;
