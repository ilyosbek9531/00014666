const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const { uuid } = require("uuidv4");
const multer = require("multer");

app.set("view engine", "pug");
app.use("/public", express.static("public"));
app.use("public", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

const PORT = 5050;

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/addStudent", (req, res) => {
  res.render("addStudent");
});

// Uploaded Image function
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

let upload = multer({
  limits: {
    fileSize: 10000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload a valid image file"));
    }

    cb(undefined, true);
  },
  storage: storage,
});

// Add Student
app.post("/addStudent", upload.single("student_image"), (req, res) => {
  const { student_name, student_id, student_birth, student_gender } = req.body;
  const student_image = req?.file?.filename;
  if (student_name && student_id.length == 8 && student_birth) {
    fs.readFile("./data/students.json", (err, data) => {
      if (err) throw err;
      const students = JSON.parse(data);
      if (
        students.find((student) => student.student_id == student_id) ==
        undefined
      ) {
        students.push({
          id: uuid(),
          student_name,
          student_id,
          student_birth,
          image: student_image,
          student_gender,
        });
        const newStudents = JSON.stringify(students);
        fs.writeFile("./data/students.json", newStudents, (err) => {
          if (err) throw err;
          res.render("addStudent", { added: "successfully added" });
        });
      } else {
        res.render("addStudent", {
          alreadyHasStudentId: "student id is already added",
        });
      }
    });
  } else {
    res.render("addStudent", { required: true });
  }
});

// // All Information Page
// app.get("/all-information", (req, res) => {
//   fs.readFile("./data/posts.json", (err, data) => {
//     if (err) throw err;
//     const posts = JSON.parse(data);
//     res.render("all-information", { posts: posts });
//   });
// }); // all-information page render && posts is sended from back-end to front-end

// // Find method
// app.get("/all-information/:id", (req, res) => {
//   const id = req.params.id;
//   fs.readFile("./data/posts.json", (err, data) => {
//     if (err) throw err;
//     const posts = JSON.parse(data);
//     const singlePost = posts.find((elem) => elem.id == id);
//     res.render("single-post", { singlePost });
//   });
// });

// //Deleted method
// app.get("/:id/delete", (req, res) => {
//   //delete getga o'tishi kere
//   const id = req.params.id;
//   fs.readFile("./data/posts.json", (err, data) => {
//     if (err) throw err;
//     const posts = JSON.parse(data);
//     const remainPosts = posts.filter((elem) => elem.id != id);
//     const postsStringify = JSON.stringify(remainPosts);
//     fs.writeFile("./data/posts.json", postsStringify, (err) => {
//       if (err) throw err;
//       res.render("all-information", { posts: remainPosts, delete: true });
//     });
//   });
// });

app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`server is running on port ${PORT}`);
});

// deleteni form post get orqali qilish kere
// multer libraries orqali image bilan ishlash kere paperda korsatilgandek
// responsive bolishi shart emas
// input requared emas uni node js bilan qilish kerak
// successfully uploaded yozuvi va input toldirilmasa toldiring yozuvi chiqishi kerak
//
