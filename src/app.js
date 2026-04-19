require("dotenv").config();
const express = require("express");
const session = require("express-session")
const passport = require("./config/passport");
const prisma = require("./config/prisma");
const PrismaSessionStore = require("@quixo3/prisma-session-store").PrismaSessionStore;
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("node:path");
const authRouter = require("./routes/auth.route");
const homeRouter = require("./routes/home.route")

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // cleanup expired sessions
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined
    }),
  })
);

app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
}) 

// routes
app.use("/", authRouter)
app.use("/", homeRouter)


app.listen(PORT, (error) => {
    if (error) {
        throw error;
    }

    console.log(`Server is running on port ${PORT}`);
})