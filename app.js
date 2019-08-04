var express = require('express');
var bodyparser = require('body-parser');
var cors = require('cors')


const app = express();

// middleware
app.use(bodyparser.json());
app.use(cors());

// routes
app.use(require('./routes'));


// port
const port = process.env.PORT || 3000;

app.listen(port, () =>{
    console.log(`🚀 Server is running at port ${port}`)
})