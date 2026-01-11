"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var express_1 = require("express");
var cookie_parser_1 = require("cookie-parser");
var cors_1 = require("cors");
var auth_1 = require("./routes/auth");
var sports_1 = require("./routes/sports");
var user_1 = require("./routes/user");
var games_1 = require("./routes/games");
var notifications_1 = require("./routes/notifications");
var venues_1 = require("./routes/venues");
var clubs_1 = require("./routes/clubs");
var safety_1 = require("./routes/safety");
var chat_1 = require("./routes/chat");
var ratings_1 = require("./routes/ratings");
var app = (0, express_1.default)();
var port = process.env.PORT || 4000;
app.use((0, cors_1.default)({
    origin: process.env.WEB_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.get('/health', function (req, res) {
    res.json({ status: 'ok' });
});
app.get('/version', function (req, res) {
    res.json({
        name: 'NORIJJAK',
        version: '0.1.0',
        env: process.env.NODE_ENV || 'development'
    });
});
app.use('/auth', auth_1.default);
app.use('/sports', sports_1.default);
app.use('/user', user_1.default);
app.use('/games', games_1.default);
app.use('/notifications', notifications_1.default);
app.use('/venues', venues_1.default);
app.use('/clubs', clubs_1.default);
app.use('/safety', safety_1.default);
app.use('/games/:id/chat', chat_1.default);
app.use('/ratings', ratings_1.default);
if (require.main === module) {
    app.listen(port, function () {
        console.log("API listening at http://localhost:".concat(port));
    });
}
exports.default = app;
