const UserCollection = require('../db/model');
const jwt = require('jsonwebtoken');

const Auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const varifyUser = jwt.verify(token, process.env.SECRETKEY);
        if (!varifyUser) {
            console.log("UNAUTHORIZED USER");
            res.status(401).json("UNAUTHORIZED USER");
        } else {
                console.log(varifyUser);
            const rootUser = await UserCollection.findById({ _id: varifyUser._id});
            console.log(rootUser);
            req.rootUser=rootUser;
        }

        next();

    } catch (e) {
        console.log(e);
        res.status(401).json("UnAuthorized User");
    }
}
module.exports = Auth;