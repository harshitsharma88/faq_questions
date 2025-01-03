require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: '*'}));

//Routes
const homeRoutes = require('./routes/homeRoute');
const faqRoutes = require('./routes/addQuestionRoutes');
const deleteRoutes = require("./routes/deleteRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes")

app.use('/delete', deleteRoutes)
app.use('/faq', faqRoutes);
app.use("/feedback", feedbackRoutes)
app.use('/', homeRoutes);

app.use(cors({ origin: '*'}));
app.use(express.static(`${__dirname}/views`));

app.listen(PORT, async ()=>{
    console.log(`Server Started at ${PORT}`);
});