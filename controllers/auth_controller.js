const User = require('../models/user_model');

exports.showLogin = (req, res) => {
  res.render('login', { pageTitle: 'Login' });
};

exports.showRegister = (req, res) => {
  res.render('register', { pageTitle: 'Create Account' });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || password.length < 8) {
      return res.status(422).render('register', {
        pageTitle: 'Create Account',
        error: 'Please provide a name, valid email, and password with at least 8 characters.'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).render('register', {
        pageTitle: 'Create Account',
        error: 'An account with this email already exists.'
      });
    }

    const user = await User.create({ name, email, password });
    req.session.user = { id: user._id.toString(), name: user.name, email: user.email };
    return res.redirect('/dashboard');
  } catch (error) {
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || '').toLowerCase().trim() });

    if (!user || !(await user.comparePassword(password || ''))) {
      return res.status(401).render('login', {
        pageTitle: 'Login',
        error: 'Invalid email or password.'
      });
    }

    req.session.regenerate((error) => {
      if (error) {
        return next(error);
      }

      req.session.user = { id: user._id.toString(), name: user.name, email: user.email };
      return res.redirect('/dashboard');
    });
  } catch (error) {
    return next(error);
  }
};

exports.logout = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }

    res.clearCookie('cvmakerplus.sid');
    return res.redirect('/login');
  });
};
