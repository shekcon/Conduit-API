const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors')
const mongoose = require('mongoose');

// register 
require('./config/passport');

const app = express();

// middleware
app.use(bodyparser.json());
app.use(cors());

// mongodb
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, autoIndex: false});
if (process.env.NODE_ENV === 'development')
    mongoose.set('debug', true);

// init admin user
require('./config/seeddb')

// routes
app.use(require('./routes'));



// port
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`🚀 Server is running at port ${port}`)
})