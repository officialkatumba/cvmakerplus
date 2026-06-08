const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const morgan = require('morgan');
const methodOverride = require('method-override');

const authRoutes = require('./routes/auth_routes');
const cvRoutes = require('./routes/cv_routes');
const errorHandler = require('./middlewares/error_handler');

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);
app.use(morgan(isProduction ? 'combined' : 'dev'));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(express.json({ limit: '2mb' }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    name: 'cvmakerplus.sid',
    secret: process.env.SESSION_SECRET || 'development-only-session-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions',
      ttl: 60 * 60 * 24 * 14
    }),
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 14
    }
  })
);

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.pageTitle = 'CV Maker Plus';
  res.locals.error = null;
  next();
});

app.use('/', authRoutes);
app.use('/', cvRoutes);

app.use((req, res) => {
  res.status(404).render('dashboard', {
    pageTitle: 'Not Found',
    cvs: [],
    error: 'The page you requested could not be found.'
  });
});

app.use(errorHandler);

module.exports = app;
