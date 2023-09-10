const start =  require('./tracer');
const meter = start('employee-service'); 
const express = require('express');
const PORT = parseInt(process.env.PORT || '8080');
const app = express();
const axios = require("axios")


const calls = meter.createHistogram('http-calls');

const sleep = (time) => { return new Promise((resolve) => { setTimeout(resolve, time) }) };

app.use((req,res,next)=>{
    const startTime = Date.now();
    req.on('end',()=>{
        const endTime = Date.now();
        calls.record(endTime-startTime,{
            route: req.route?.path,
            status: res.statusCode,
            method: req.method
        })
    })
    next();
})

app.get('/employees', async (req, res) => {

    if(req.query['fail']){
        return res.sendStatus(500)
    }

    if (req.query['slow']) {
        await sleep(1000);
    }
    
    const employee = [
        {
            name: "Employee 1",
            salary: "10000",
            age: "25"
        },
        {
            name: "Employee 2",
            salary: "30000",
            age: "24"
        }
    ]
    const user = await axios.get('http://auth:8080/auth');
    res.send(employee);
});

app.listen(PORT, () => {
    console.log(`Listening for requests on http://localhost:${PORT}`);
});
