const authRouter = require("express").Router();
const authController = require("../controllers/auth.controller");
const passport = require("../config/passport");
const {loginValidator} = require("../validators/loginValidator")


authRouter.get("/sign-up", authController.signUpForm)
authRouter.post("/sign-up", authController.signUp);
authRouter.get("/login", authController.loginForm);
authRouter.post("/login", loginValidator, (req, res, next) => {
  const { validationResult } = require("express-validator");
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("login", {
      errors: errors.mapped(),
      oldInput: req.body,
      failureMessage: null
    });
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.render("login", {
        errors: {},
        oldInput: req.body, // ✅ keeps email filled
        failureMessage: info?.message || "Invalid email or password"
      });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/");
    });
  })(req, res, next);
});

authRouter.get("/logout", authController.logout)

module.exports = authRouter