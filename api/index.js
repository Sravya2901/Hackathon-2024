// const express = require('express');
// Now process.env.TWILIO_ACCOUNT_SID will be available
import express from 'express';
// const bodyParser = require('body-parser');
import bodyParser from 'body-parser';
// const messageRoutes = require('./routes/messageRoutes');
import messageRoutes from './routes/messageRoutes.js'
const app = express();
// const cors = require('cors');
import cors from 'cors';
    const port=5000;
    // The rest of your application logic here, or import the rest of your application modules
app.use(cors());
console.log(port)
app.use(bodyParser.json());
app.use('/', messageRoutes);
app.listen(port, () => {

    console.log(`Server is running on port ${port}`);
})