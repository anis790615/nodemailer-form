const express = require("express");
const hbs = require("express-handlebars");
const nodemailer = require("nodemailer");
const keys = require("./config/keys");

const app = express();
// Initializing Handlebars
app.engine(
  "hbs",
  hbs({
    layoutsDir: "views/layouts/",
    defaultLayout: "main-layout",
    extname: "hbs",
  })
);
app.set("view engine", "hbs");
// Initialise parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("contact", {
    pageTitle: "Nodemailer Contact Form",
  });
});
app.post("/send", async (req, res) => {
  const output = `<p>You have a new contact request</p>
  <h3>Contact Details</h3>
  <ul>
    <li>Name: ${req.body.name}</li>
    <li>Company: ${req.body.company}</li>
    <li>Email: ${req.body.email}</li>
    <li>Phone: ${req.body.phone}</li>
  </ul>
  <h3>Message</h3>
  <p>${req.body.message}</p>`;

  // create reusable transporter object using the default SMTP transport

  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: keys.authUser, // your full email
      pass: keys.authPassword, // your password
    },
  });
  try {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: "'Nodemailer Contact' <anis.alkomem@outlook.com>", // Sender address
      to: "anis790615@mail.ru", // List of receivers
      subject: "Node Contact Request", // Subject Line
      text: "Hello World", // Plain text Body
      html: output,
    });
    console.log("Message sent: %s", info.messageId);
    res.render("contact", {
      pageTitle: "Nodemailer Contact Form",
      msg: "Email has been sent",
    });
  } catch (err) {
    console.log(err);
  }
});
// Set static folder
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
