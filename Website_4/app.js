require('dotenv').config()
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const Event = require('./models/event');
const Link = require('./models/link');
const Site = require('./models/site');
const fs = require('fs');

// express app
const app = express();

const password = process.env.MONGODB_PASSWD;
const username = process.env.MONGODB_USERNM;
// connect to mongoDB database.
const dbURI = 'mongodb+srv://' + username + ':' + password + '@cluster0.85jkitw.mongodb.net/website-general?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(5000))
  .catch((err) => console.log(err))
const db = mongoose.connection;

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(morgan('dev'));

/** Unsure... **/
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use('/pdf', express.static(path.join(__dirname, 'pdf_files')));

/** Process requests and direct pages -- Note: Always include 'sites', 'links', and a title. */
// Home page
app.get('/', async (req, res) => {
  try {
    const [links, sites] = await Promise.all([Link.find({}).sort({ order_no: 'asc' }),
    Site.find({}).sort({ order_no: 'asc' })]);
    res.render('index', { title: "Home", links, sites })
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

app.get('/resume', async (req, res) => {
  try {
    let currentDate = `${process.env.RESUME_DATE}`;
    var file = fs.createReadStream('pdf_files/BXGResume.redactable.pdf');
    var stat = fs.statSync('pdf_files/BXGResume.redactable.pdf');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=BXGResume_${currentDate}.pdf`);
    file.pipe(res);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// Projects/Blog page
app.get('/projects', async (req, res) => {
  try {
    const [blogs, links, sites] = await Promise.all([Blog.find({}),
    Link.find({}).sort({ order_no: 1 }),
    Site.find({}).sort({ order_no: 1 })]);
    res.render('projects', { title: "Portfolio", blogs, links, sites })
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// About/Career/Timeline page
app.get('/about', async (req, res) => {
  try {
    const [links, sites, events] = await Promise.all([Link.find({}).sort({ order_no: 1 }),
    Site.find({}).sort({ order_no: 1 }),
    Event.find({}).sort({ order_no: -1 })]);
    res.render('about', { title: "About Me", links, sites, events })
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// 404 page
app.use(async (req, res) => {
  try {
    const [links, sites] = await Promise.all([Link.find({}).sort({ order_no: 'asc' }),
    Site.find({}).sort({ order_no: 'asc' })]);
    res.status(404).render('404', { title: '404', links, sites })
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});