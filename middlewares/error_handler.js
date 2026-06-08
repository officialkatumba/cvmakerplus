function errorHandler(error, req, res, next) {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  return res.status(error.status || 500).render('dashboard', {
    pageTitle: 'Application Error',
    cvs: [],
    error: error.message || 'Something went wrong. Please try again.'
  });
}

module.exports = errorHandler;
