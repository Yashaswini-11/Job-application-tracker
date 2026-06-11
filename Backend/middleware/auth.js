const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {

    const token = req.header("Authorization");

    console.log("TOKEN RECEIVED:", token);

    if (!token) {

        return res.status(401).json({
            message: "No token, access denied"
        });

    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("DECODED:", decoded);

        req.user = decoded;

        next();

    } catch (error) {

        console.log("AUTH ERROR:", error.message);

        return res.status(401).json({
            message: "Invalid token"
        });

    }

};

module.exports = auth;