const server = () => {
    const express = rerquire ("express");
    const app = express();
    const mongoose = require("mongoose");
    const MongoStore = require('connect-mongo');

    //MASTER DB CONNECTION
    const dbClient  = require("../vars/db");
    const environmentToExport = require('../config/config');

    const session = require('express-session');

    // Connect to MongoDB
        mongoose
        .connect(
        db,
        { useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindandModify: false,
            useCreateIndex: true
        }
        )
        .then(() => console.log('MongoDB Connected'))
        .catch(err => console.log(err));


    app.use(
        session({
            secret: "bel34@!Qhn#UwUWmlx83WJU6q#5!Y(|&$|io", //process.env.sessionSecret
            resave: true,
            saveUninitialized: true,
            cookie: { maxAge: 60 * 60000 }, // store for 60 minutes
            store: MongoStore.create({
                client: mongoose.connection.getClient()
            })
        })
    );


    //Error Manager
    const apiErrorHandler = require('../api/v1/middlewares/errorManager/apiErrorHandler')
    
    //Custom error handler to prevent exposure to security vulnerabiilities by exposure of server error traces, 
    app.use(apiErrorHandler);

    //Express body parser
    app.use(express.urlencoded({ extended: true }));

    //Routes
    app.use("/", require("../api/v1/routes/Index.js"));

    const PORT = process.env.PORT || 6000;

    app.listen(PORT, console.log(`Express Server started successfuly on PORT ${PORT}`));

}

module.exports = server;