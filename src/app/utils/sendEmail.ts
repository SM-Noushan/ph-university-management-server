import config from "../config";
import nodemailer from "nodemailer";

export const sendEmail = async (to: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: config.NODE_ENV === "production" ? true : false,
    auth: {
      user: config.transporterEmail,
      pass: config.transporterPassword,
    },
  });

  await transporter.sendMail({
    from: '"PH University👻" <phUniversity@ph.com>', // sender address
    to: to, // list of receivers
    subject: "Reset Password (Expires in 10m)", // Subject line
    text: "Hello world?", // plain text body
    html: `<a target='_blank' href=${resetLink}>Reset Now</a>`, // html body
  });
};
