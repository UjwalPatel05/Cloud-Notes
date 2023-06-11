const jwt = require('jsonwebtoken');
const SEC_KEY = process.env.SEC_KEY;

const authUser = (req, res, next) => {
    try {
        const token = req.header("auth-header");
        if (!token) {
            return res
                .status(401)
                .send({ error_message: "Please Authentiate with correct token", error: 1 });
        }
        const verify = jwt.verify(token, SEC_KEY);
        if (verify) {
            req._id = verify._id;
            next();
        } else {
            return res
                .status(401)
                .send({ error_message: "Please Authentiate with correct token", error: 1 });
        }
    } catch (error) {
        return res.status(500).send({ default_error: error, error_message: "Please Authentiate with correct token", error: 1 })
    }
}

module.exports = authUser