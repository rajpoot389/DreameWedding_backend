const express = require("express");
const app = express();
require("./db/conn");
const path = require('path');
const UserCollection = require("./db/model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Auth = require("./middleware/Auth");
const cookieParser = require('cookie-parser')
const multer = require("multer");
const PORT = process.env.PORT || 8000;

app.use(express.static('/Client/public'))



// Middlewares...................................................
app.use(express.json());
app.use(cookieParser());
const staticPath = path.join(__dirname, "./public");
app.use(express.static('public'));


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/img');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
        console.log(req.file);
    }
})
const upload = multer({ storage: storage });




// All The Route Are Here........................................

// app.get("/", (req, res) => {
//     res.send("Hello this is home page");
// });

//For Registration...............................................

app.post("/register", upload.single("photo"), async (req, res) => {
    try {
        // const photo_file=req.file.filename;
        // console.log(req.body);
        const { profile_for, fname, lname, city, state, dob, matrial_status, height, diet, gender, religion, age, qualification, profession, number, email, password, conform_password } =
            req.body;

        // console.log(
        //     `${profile_for},${fname},${lname},${email},${password},${conform_password},${matrial_status},${dob},${city},${state},${height},${diet},${gender},${qualification},${profession},${number},${photo_file}`
        // );

        if (password === conform_password) {
            // const photo_file=req.file.filename;
            if (!profile_for || !fname || !lname || !email || !password || !conform_password || !matrial_status || !dob || !city || !state || !height || !diet || !gender || !qualification || !profession || !number || !religion || !age | !req.file.filename) {
                return res.status(422).json("Pls fill All the fields");
            }
            const emailData = await UserCollection.findOne({ email });
            if (emailData) {
                return res.json("email already exits");
            } else {
                const userData = new UserCollection({
                    profile_for: req.body.profile_for,
                    fname: req.body.fname,
                    lname: req.body.lname,
                    email: req.body.email,
                    password: req.body.password,
                    conform_password: req.body.conform_password,
                    matrial_status: req.body.matrial_status,
                    dob: req.body.dob,
                    city: req.body.city,
                    state: req.body.state,
                    height: req.body.height,
                    diet: req.body.diet,
                    gender: req.body.gender,
                    religion: req.body.religion,
                    age: req.body.age,
                    qualification: req.body.qualification,
                    profession: req.body.profession,
                    number: req.body.number,
                    photo: req.file.filename
                });

                res.status(200).json("Registration SucessFull");
                const result = await userData.save();
                console.log(result);
            }
        } else {
            res.status(422).json("Password are not matching");

        }
    } catch (e) {
        console.log(e);
    }
});


//For Login............................................................

app.get("/signin", (req, res) => {
    res.send("LOgin Page!");
});

app.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(402).json("Pls fill all the fields");
    }

    const data = await UserCollection.findOne({ email });
    if (data) {
        const isMatch = await bcrypt.compare(password, data.password);
        if (!isMatch) {
            res.status(402).json("Incorrect Password");
        } else {
            const token = await data.generateAuthToken();
            res.cookie("jwt", token, {
                // expires:new Date(Date.now()+500000),
                httpOnly: true
            })
            // console.log(token);
            console.log(data);
            res.json("User Login Successful");

        }
    } else {
        res.status(402).json("Wrong Email!");
    }
});


// Routr For After Login***************************************************
app.get("/afterlogin", Auth, async (req, res) => {
    res.status(201).json(req.rootUser);
    // res.json("h")
})


// Route For User*******************************************************
app.get("/user", Auth, async (req, res) => {
    res.status(201).json(req.rootUser);
})





app.post("/showuser", Auth, async (req, res) => {
    const { gender, religion, age_from, age_to } = req.body;
    // console.log(req.body);
    // console.log(religion);
    // const data= await UserCollection.find();
    // // const data=await UserCollection.find({$and:[{gender:gender},{religion:religion},{age:{$gte:age_from}},{age:{$lte:age_to}}]});
    const data = await UserCollection.find({ gender: gender, religion: religion, $and: [{ age: { $gte: age_from } }, { age: { $lte: age_to } }] });

    res.status(200).json(data)
    console.log(data);
    // res.status(200).json("Suceess")
})




// Route For Get Perticular User Details**********************************
app.post("/perticular_user_details", async (req, res) => {
    const id = req.body.id;
    const data = await UserCollection.findById(id)
    res.status(200).json(data)
})

// Route For Logout User*****************************************
app.get("/logout", (req, res) => {
    console.log("hello logout paeg");
    res.clearCookie('jwt', { path: '/' });
    res.status(200).json("User Logout");
})


// For Banner From Route***********************************
app.get("/checkAuth", Auth, async (req, res) => {
    console.log("CkeckAuth called");
    res.status(200).json("You Are Authorized");

})

if (process.env.NODE_ENV == "production") {
    app.use(express.static("Client/build"));
    // const path = require("path");
    // app.get("*", (req, res) => {
    //     res.sendFile(path.resolve(__dirname, "Client", "build", "index.html"))
    // })

}



app.listen(PORT, () => {
    console.log("Listening Successfull");
});










