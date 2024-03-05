import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "fingerprint",
});

// to send from html body
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json("Hello World");
});

app.get("/user", (req, res) => {
  const q = "SELECT * FROM users";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/user", (req, res) => {
  const q = "INSERT INTO users (`id`,`email`,`password`) VALUES (?)";
  // const values=["title from backend","desc from backend","cover pic from backend"];
  const values = [req.body.id, req.body.email, req.body.password];
  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("user has been created.");
  });
});

app.delete("/user/:id", (req, res) => {
    const userId = req.params.id;
    const q = "DELETE FROM users WHERE id = ?";
  
    db.query(q, [userId], (err, data) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        if (data.affectedRows === 0) {
          return res.status(404).json({ error: "User not found" });
        } else {
          return res.json({ message: "User has been deleted." });
        }
      }
    });
  });

// app.put("/user/:id", (req,res)=>{
//     const bookId=req.params.id;
//     const q="UPDATE books SET `title`=?,`desc`=?,`price`=?,`cover`=? WHERE id=?"
//     const values=[
//         req.body.title,
//         req.body.desc,
//         req.body.price,
//         req.body.cover
//     ]
//     db.query(q,[...values, bookId],(err,data)=>{
//         if(err) return res.json(err)
//         return res.json("Book has been updated.")
//     })
// })

app.listen(8800, () => {
  console.log("Connect to backend.");
});
