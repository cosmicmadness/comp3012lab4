const express = require("express");
const router = express.Router();
const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");

router.get("/", (req, res) => {
  res.send("welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});

router.get("/admin", ensureAuthenticated, (req, res) => {
  if(req.user.role === "admin") {
    let store = req.sessionStore.sessions;  
    let sessionID = req.session.id;
    res.render("admin", {user: req.user, session: store, sessionID})
  } else {
    res.send("You are not authorized to view this page.");
  }
});

router.get('/revoke:sessionID', (req, res) => {
  let sessionID = req.params.sessionID;
  let store = req.sessionStore;
  store.destroy(sessionID, (err, data) => {
    if(err) {
      console.log("An error occurred");
      res.redirect("/admin");
    } else {
      console.log(`The user session ${sessionID} was successfully revoked.`)
      res.redirect("/admin");
    }
  })
});



module.exports = router;
