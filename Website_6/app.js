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

// Get port no.
const port = process.env.PORT || 3000;

// express app
const app = express();

const password = process.env.MONGODB_PASSWD;
const username = process.env.MONGODB_USERNM;
// connect to mongoDB database.
const dbURI = `mongodb+srv://${username}:${password}@cluster0.85jkitw.mongodb.net/website-general?retryWrites=true&w=majority`;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(port, function() {
    console.log(`Listening to port: ${port}`);
  }))
  .catch((err) => console.log(err))
const db = mongoose.connection;

// get database constants.
let cachedLinks = null;
let cachedSites = null;
let cachedBlogs = null;
let cachedEvents = null;


const fetchData = async () => {
  try {
    [cachedLinks, cachedSites, cachedBlogs, cachedEvents] = await Promise.all([
      Link.find({}).sort({ order_no: 'asc' }),
      Site.find({}).sort({ order_no: 'asc' }),
      Blog.find({}),
      Event.aggregate([
        {
            $project: {
                start_date: {$dateToString: {format: "%Y/%m/%d" , date: "$start_date",}},
                end_date: {$dateToString: {format: "%Y/%m/%d" , date: "$end_date", onNull: "Present"}},
                title: 1, 
                desc: 1, 
                link: 1, 
                loc: 1, 
                order_no: 1 
            }
        },
        { $sort: { "order_no": -1 }}
      ])
    ]);
  } catch (e) {
    console.log(e);
  }
};

// Fetch the data right after the server starts
fetchData();

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(morgan('dev'));

/** Join Paths **/
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use('/pdf', express.static(path.join(__dirname, 'pdf_files')));

/** Process requests and direct pages -- Note: Always include 'sites', 'links', and a title. */
// Home page
app.get('/', (req, res) => {
  try {
    res.render('index', { title: "Home", links: cachedLinks, sites: cachedSites})
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
app.get('/projects', (req, res) => {
  try {
    res.render('projects', { title: "Portfolio", blogs: cachedBlogs, links: cachedLinks, sites: cachedSites })
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// About/Career/Timeline page
app.get('/about', (req, res) => {
  try {
    res.render('about', { title: "About Me", links: cachedLinks, sites: cachedSites, events: cachedEvents})
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// 404 page
app.use(async (req, res) => {
  try {
    res.status(404).render('404', { title: '404', links: cachedLinks, sites: cachedSites })
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});