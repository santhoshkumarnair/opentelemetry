const start =  require('./tracer');
start('auth-service');
const express = require('express');
const PORT = parseInt(process.env.PORT || '8080');
const app = express();



app.get('/auth', async (req, res) => {
    const respData = {
        empId : 1,
        token: "Auth-Token"
    }

    res.send(respData);
});

app.listen(PORT, () => {
    console.log(`Listening for requests on http://localhost:${PORT}`);
});
