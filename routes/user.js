//user auth routes start here
const { Router } = require("express");
const router = Router();
const  User  = require("../DAO/user");
const jwt = require("jsonwebtoken");
//const { isAuthorized } = require("../middleware/authMiddleware");

//Login
//Signup: POST /user/signup
router.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    //console.log(" in sign up - req.body",email, password);

    if (!email || !password) {
        return res.status(400).json({ error: "email and/or password are required" });
    }

    try {
        const user = await User.createUser( email, password );
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "email and/or password are required" });
    }

    try {
        //find user by email
        const user = await User.login(email,password);

        //console.log("user", user);

        if(!user){
            res.status(401).json({ error: "Invalid email or password" });
        }

        //token passes user details like email, roles, etc
        const token = jwt.sign({ _id: user._id, email: user.email, roles: user.roles }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});



//Logout: POST /user/logout
//Need to use Token Versioning to invalidate tokens are remove access
router.post("/logout", (req, res) => {
    res.status(200).json({ message: "Logout successful" });
});

module.exports = router;