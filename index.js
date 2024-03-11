const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');

connectToMongo();
const app = express();
const port = 3001;

app.use(cors())
app.use(express.json());

//Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/note', require('./routes/note'));

app.listen(port, () => {
    console.log(`Connected to port ${port}`);
})