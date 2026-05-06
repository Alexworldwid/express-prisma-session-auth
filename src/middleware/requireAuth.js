const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.render("login", {
      errors: {},
      oldInput: {},
      failureMessage: null
    });
  }

  next();
};

module.exports = requireAuth;
