const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  const flashMessages = req.flash();
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: flashMessages.error ? flashMessages.error[0] : null,
  });
};

exports.postLogin = (req, res, next) => {
  req.flash("error", "Invalid email or password.");
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password.");
        return res.redirect("/login");
      }
      return bcrypt
        .compare(req.body.password, user.password)
        .then((doMatch) => {
          if (!doMatch) {
            req.flash("error", "Invalid email or password.");
            return res.redirect("/login");
          }

          req.session.isLoggedIn = true;
          req.session.user = user;
          req.session.save(() => {
            res.redirect("/");
          });
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email already exists.");
        return res.redirect("/signup");
      }

      if (password !== confirmPassword) {
        req.flash("error", "Password doesn't match");
        return res.redirect("/signup");
      }

      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            name: name,
            cart: { items: [] },
          });

          return user.save();
        })
        .then(() => {
          return res.redirect("/");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  const flashMessages = req.flash();
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    errorMessage: flashMessages.error ? flashMessages.error[0] : null,
  });
};
