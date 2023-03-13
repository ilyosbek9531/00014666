const { Router } = require("express");
const { uuid } = require("uuidv4");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = new Router();

router.get("/", (req, res) => {
  res.render("home");
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
router.post("/addStudent", upload.single("student_image"), (req, res) => {
  const { student_name, student_id, student_birth, student_gender } = req.body;
  const student_image = req?.file?.filename;
  if (student_name && student_id.length == 8 && student_birth) {
    if (Boolean(student_name?.match(/^[A-Za-z\s]*$/))) {
      fs.readFile("./data/students.json", (err, data) => {
        if (err) throw err;
        const students = JSON.parse(data);
        const singleStudentId = students.find(
          (student) => student.student_id == student_id
        );

        if (singleStudentId?.id) {
          const studentById = students.filter(
            (student) => student.id != singleStudentId?.id
          );
          studentById.unshift({
            id: singleStudentId?.id,
            student_name,
            student_id,
            student_birth,
            image: student_image ? student_image : singleStudentId.image,
            student_gender,
          });
          const newStudents = JSON.stringify(studentById);
          fs.writeFile("./data/students.json", newStudents, (err) => {
            if (err) throw err;
            res.render("addStudent", {
              update:
                "There is a student with this ID. Do you want to update information?",
            });
          });
        } else {
          students.unshift({
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
            res.render("addStudent", {
              added: "successfully added",
            });
          });
        }
      });
    } else {
      res.render("addStudent", { required: true, student_name_string: true });
    }
  } else {
    res.render("addStudent", { required: true });
  }
});

router.get("/addStudent", (req, res) => {
  const singleStudentId = req.query.id;
  fs.readFile("./data/students.json", (err, data) => {
    if (err) throw err;
    const students = JSON.parse(data);
    const singleStudent = students.find(
      (student) => student.id == singleStudentId
    );

    res.render("addStudent", {
      student_name: singleStudent?.student_name,
      student_id: singleStudent?.student_id,
      student_image: singleStudent?.image,
      student_birth: singleStudent?.student_birth,
      student_gender: singleStudent?.student_gender,
    });
  });
});

router.get("/students", (req, res) => {
  const gender = req.query.gender;
  fs.readFile("./data/students.json", (err, data) => {
    if (err) throw err;
    const students = JSON.parse(data);
    if (gender == "male" || gender == "female") {
      const filteredStudents = students.filter(
        (student) => student.student_gender == gender
      );
      res.render("students", { students: filteredStudents });
    } else {
      res.render("students", { students });
    }
  });
});

router.get("/students/:id", (req, res) => {
  const studentId = req.params.id;
  fs.readFile("./data/students.json", (err, data) => {
    if (err) throw err;
    const students = JSON.parse(data);
    const studentById = students.find((student) => student.id == studentId);
    res.render("singleStudent", { studentById });
  });
});

router.get("/:id/delete", (req, res) => {
  const id = req.params.id;
  fs.readFile("./data/students.json", (err, data) => {
    if (err) throw err;
    const allStudents = JSON.parse(data);
    const students = allStudents.filter((student) => student.id != id);
    const stringifiedStudents = JSON.stringify(students);
    const singleStudent = allStudents.find((student) => student.id == id);

    fs.writeFile("./data/students.json", stringifiedStudents, (err) => {
      if (err) throw err;
      if (singleStudent.image) {
        fs.unlink(`public/uploads/${singleStudent?.image}`, (err) => {
          if (err) throw err;
          console.log("deleted successfully");
        });
      }
      res.render("students", { students, delete: true });
    });
  });
});

module.exports = router;
