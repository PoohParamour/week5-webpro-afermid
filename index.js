const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

app.use(cookieParser());



app.listen(port, () => {
    console.log(`Starting node.js at port ${port}`);
});