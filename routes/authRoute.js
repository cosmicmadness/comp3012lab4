const express = require("express");
const passport = require("../middleware/passport");
const { forwardAuthenticated } = require("../middleware/checkAuth");

const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => res.render("login"));

router.post(
  "/login",
  passport.authenticate("local", {
    scope: [ 'user:email' ],
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
  })
);

router.post(
  "/github",
  passport.authenticate("github", {
    scope: [ 'user:name' ],
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
  })
);


router.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy(function(err) {
    // cannot access session here
  })
  res.redirect("/auth/login");
});


router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/dashboard');
});

module.exports = router;
