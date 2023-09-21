const start =  require('./tracer');
start('auth-service');
const express = require('express');
const PORT = parseInt(process.env.PORT || '8080');
const app = express();
const logger = require("./winston.js")


app.get('/auth', async (req, res) => {
    logger.info("Auth API request")
    const respData = {
        empId : 1,
        token: "Auth-Token"
    }

    res.send(respData);
});

app.listen(PORT, () => {
    console.log(`Listening for requests on http://localhost:${PORT}`);
});
