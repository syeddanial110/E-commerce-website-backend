const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: false,
  requireTLS: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "syed.danial@paceglobalpk.net",
    pass: "Password@360",
  },
});

// const mailOptions = {
//     from: 'syed.danial@paceglobalpk.net',
//     to: 'syed.danial@paceglobalpk.net',

// }
const sendMail = async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: "<syed.danial@paceglobalpk.net>", // sender address
      to: "syed.danial@paceglobalpk.net", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    res.json({
      message: "Mail sent successfully",
    });
  } catch (error) {
    console.log("Error sending email:", error);
    res.status(500).json({
      message: "An error occurred while sending the email.",
    });
  }
};

module.exports = sendMail;
