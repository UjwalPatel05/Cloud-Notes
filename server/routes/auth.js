const express = require("express");
const Router = express.Router()
const User = require("../models/User")
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');
const authUser = require("../middleware/authUser");
const SEC_KEY = process.env.SEC_KEY;
const nodemailer = require("nodemailer");


// Route 1: Create User
// Path: /api/auth/createUser

Router.post("/createUser", async(req, res) => {

    const checkUser = await User.findOne({ email: req.body.email })

    if (checkUser) {
        // 409 (Conflict)
        return res.status(409).send({ error_message: "Email already exists...!", error: 1 })
    }

    try {

        const hpass = await bcrypt.hash(req.body.password, 12);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hpass
        })
        await user.save();
        data = {
            _id: user._id
        };
        const token = jwt.sign(data, SEC_KEY);
        return res.send({ token: token });

    } catch (error) {
        return res.status(500).send({ default_error: error, error_message: "Internal Server Error...!!!", error: 1 })
    }

})


// Route 2: Login User
// Path: /api/auth/loginUser

Router.post("/loginUser", async(req, res) => {
    const { email, password } = req.body
    try {

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).send({ error_message: "Please try with correct credentials...!!!", error: 1 })
        } else {
            const check_password = await bcrypt.compare(password, user.password)
            if (!check_password) {
                return res.status(401).send({ error_message: "Please try with correct credentials...!!!", error: 1 })
            }
            data = {
                _id: user._id
            };
            const token = jwt.sign(data, SEC_KEY);
            return res.send({ token: token });
        }
    } catch (error) {
        return res.status(500).send({ default_error: error, error_message: "Internal Server Error...!!!", error: 1 })
    }
})


// Route 3: Get User Details
// Path: /api/auth/getUser

Router.post("/getUser", authUser, async(req, res) => {
    const _id = req._id
    try {
        const user = await User.findById({ _id }).select("-_id");
        res.send({ user: user })
    } catch (error) {
        return res.status(500).send({ default_error: error, error_message: "Internal Server Error...!!!", error: 1 })
    }
})

// Route 4: Update Password
// Path: /api/auth/changePassword

Router.put("/changePassword", authUser, async(req, res) => {
    const _id = req._id
    const { previousPassword, newPassword } = req.body

    try {
        const user = await User.findById({ _id })
        const passwordCheck = await bcrypt.compare(previousPassword, user.password)

        if (passwordCheck) {
            const hashPassword = await bcrypt.hash(newPassword, 12)
            await User.findByIdAndUpdate(_id, { $set: { password: hashPassword } }, { new: true })
            return res.send({ message: "Password Updated Successfully...!!!", error: 0 })
        } else {
            return res.status(500).send({ error_message: "Please provide correct previous password...!!!", error: 1 })
        }

    } catch (error) {
        return res.status(500).send({ default_error: error, error_message: "Internal Server Error...!!!", error: 1 })
    }
})


// Route 5: Send Email to Reset Password
// Path : /api/auth/sendResetPasswordLink

Router.post("/sendResetPasswordLink", async(req, res) => {

    const { email } = req.body
    const user = await User.findOne({ email: email })


    if (user) {

        const data = {
            _id: user._id
        };

        const token = jwt.sign(data, SEC_KEY, { expiresIn: '15m' });

        const Link = `${process.env.FRONT_END_URL}/resetUserPassword/${user._id}/${token}`;

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        const htmlContent = `
  <html>
    <head>
      <style>
        .reset-password-button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #ffac59;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        }

        .reset-password-button:hover {
          background-color: #de842a;
        }
      </style>
    </head>
    <body>
      <a class="reset-password-button" href="${Link}">Click here to reset password</a>
    </body>
  </html>
`;


        let info = await transporter.sendMail({
            from: process.env.EMAIL,
            to: `${user.email}`,
            subject: "Cloud Note - Reset Password Link",
            // html: `<a href="${Link}">Reset Password</a> - Click here to Reset Password`,
            html: htmlContent,
        });

        res.send({ message: "Email is sent with reset password link", error: 0 })

    } else {
        return res.status(404).send({ error_message: "Please provide valid email address...!!!", error: 1 })
    }


})


// Route 6:Reset Password by Email
// Path : /api/auth/resetUserPassword/:id/:token
Router.put("/resetUserPassword/:id/:token", async(req, res) => {
    const { password } = req.body
    const { id, token } = req.params

    const verify = jwt.verify(token, SEC_KEY);

    if (verify) {
        const hashPass = await bcrypt.hash(password, 12)
        await User.findByIdAndUpdate(id, { $set: { password: hashPass } })
        res.send({ message: "Password Reset Successfully...!!!", error: 0 })
    } else {
        return res.status(500).send({ error_message: "Internal Server Error...!!!", error: 1 })
    }
})



module.exports = Router