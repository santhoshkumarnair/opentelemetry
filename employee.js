const start = require('./tracer');
const meter = start('employee-service');
const express = require('express');
const PORT = parseInt(process.env.PORT || '8080');
const app = express();
const axios = require("axios")
const logger = require("./logger.js")
const AWS = require('aws-sdk');
const fs = require('fs');
const uuid = require('uuid');

const s3 = new AWS.S3({
    accessKeyId: 'AKIA3PACWHAXTQ2ZRNWW',
    secretAccessKey: '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'
});
const bucketName = 'observability-opentelemetry';

const calls = meter.createHistogram('http-calls');

let counter = meter.createCounter(
    'http.server.request_per_name.counter',
    {
        description: 'The number of requests per name the server got',
    }
);

const sleep = (time) => { return new Promise((resolve) => { setTimeout(resolve, time) }) };

app.use((req, res, next) => {
    const startTime = Date.now();

    req.on('end', () => {
        const endTime = Date.now();
        calls.record(endTime - startTime, {
            route: req.route?.path,
            status: res.statusCode,
            method: req.method
        })
    })
    next();
})

app.post('/upload', async (req, res) => {
    const fileData = fs.readFileSync("./images/opentelemetry.png");
    s3.upload({
        Bucket: bucketName,
        Key: `${uuid.v4()}-opentelemetry.png`,
        Body: fileData
    }, (err, data) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.send("File uploaded successfully");
        }
    });
})

app.get('/employees', async (req, res) => {

    logger.info("Get employees API request")
    if (req.query['fail']) {
        counter.add(1, {
            'route': 'employees',
            'name': 'Fail'
        });
        logger.info("Get employees API fail request")
        return res.sendStatus(500)
    }

    if (req.query['slow']) {
        logger.info("Get employees API slow request")
        counter.add(1, {
            'route': 'employees',
            'name': 'Slow'
        });
        await sleep(1000);
    }
    else {
        logger.info("Get employees API success request")
        counter.add(1, {
            'route': 'employees',
            'name': 'Success'
        });
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
