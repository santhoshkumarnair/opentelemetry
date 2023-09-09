const start =  require('./tracer');
start('employee-service'); 
const express = require('express');
const PORT = parseInt(process.env.PORT || '8082');
const app = express();
const axios = require("axios")



app.get('/employees', async (req, res) => {
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
    const user = await axios.get('http://localhost:8080/auth');
    res.send(employee);
});

app.listen(PORT, () => {
    console.log(`Listening for requests on http://localhost:${PORT}`);
});
