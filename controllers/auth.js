const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");
const { O_WRONLY } = require("constants");

const tranporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

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
          res.redirect("/");
          return tranporter
            .sendMail({
              to: email,
              from: "estebanddlp@gmail.com",
              subject: "[Test] Signup succeeded!",
              html: "<h1>Succeded!</h1>",
            })
            .then((result) => {
              console.log(result);
            })
            .catch((err) => {
              console.log(err);
            });
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

exports.getReset = (req, res, next) => {
  const flashMessages = req.flash();
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "reset",
    isAuthenticated: false,
    errorMessage: flashMessages.error ? flashMessages.error[0] : null,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      req.flash("error", err);
      return res.redirect("/reset");
    }

    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/reset");
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        return tranporter
          .sendMail({
            to: req.body.email,
            from: "estebanddlp@gmail.com",
            subject: "[Test] Signup succeeded!",
            html: `
            <h1>Reset password!</h1>
            <p>You requested a passoword reset.</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
            `,
          })
          .then((result) => {
            console.log(result);
          })
          .catch((err) => {
            console.log(err);
            req.flash("error", "Error. Please retry in a few minutes.");
            return res.redirect("/reset");
          });
      })
      .then(() => {
        return res.redirect("/login");
      })
      .catch((err) => {
        console.log(err);
        req.flash("error", "Error. Please retry in a few minutes.");
        return res.redirect("/reset");
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  User.findOne({
    resetToken: req.params.token,
    resetTokenExpiration: {
      $gt: Date.now(),
    },
  })
    .then((user) => {
      if (!user) {
        req.flash(
          "error",
          "User not found with the given token to reset password."
        );
        return res.redirect("/login");
      }

      const flashMessages = req.flash();
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "new-password",
        isAuthenticated: false,
        errorMessage: flashMessages.error ? flashMessages.error[0] : null,
        userId: user._id.toString(),
      });
    })
    .catch((err) => {
      console.log(err);
      return res.redirect("/login");
    });
};

exports.postNewPassword = (req, res, next) => {
  let resetUser;

  User.findOne({
    _id: req.body.userId,
  })
    .then((user) => {
      console.log(user);
      if (!user) {
        req.flash("error", "User not found.");
        return res.redirect("/login");
      }
      if (user.resetTokenExpiration < Date.now()) {
        req.flash("error", "The token is expired. Please generate a new one.");
        return res.redirect("/login");
      }

      resetUser = user;

      console.log(req.body.newPassword);
      return bcrypt.hash(req.body.newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;

      return resetUser.save();
    })
    .then(() => {
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
      return res.redirect("/login");
    });
};
