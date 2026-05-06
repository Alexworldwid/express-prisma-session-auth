const bcrypt = require("bcrypt")
const {body, validationResult, matchedData } = require("express-validator");
const {validateUsers} = require("../validators/signupUserValidator");
const {findUserByEmail, addUser} = require("../models/auth.model")



const signUpForm = async (req, res, next) => {
    try {
        res.render("sign-up-form", {
            errors: {},
            oldInput: {}
        })
    } catch (error) {
        next(error)
    }
}


const signUp = [
    validateUsers,
    async (req, res, next) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).render("sign-up-form", {
                    errors: errors.mapped(),
                    oldInput: req.body
                })
            }

            const {name, email, password} = matchedData(req);
            const hashedPassword = await bcrypt.hash(password, 10);

            const existingUser = await findUserByEmail(email);

            if (existingUser) {
                return res.status(400).render("sign-up-form", {
                    errors: {email: {msg: "user with email already exists"}},
                    oldInput: req.body
                })
            }

            await addUser(name, email, hashedPassword);
            res.redirect("/");

        } catch (error) {
            next(error)
        }
    }
]

const logout = async (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect("/");
  });
};

const loginForm = async (req, res, next) => {
    try {
      const messages = req.session.messages || [];
      req.session.messages = []; // clear after reading

      res.render("login", {
        errors: {},
        oldInput: {},
        failureMessage: messages[0], // single message
      });
    } catch (error) {
        next(error)
    }
}


module.exports = {signUpForm, signUp, loginForm, logout}