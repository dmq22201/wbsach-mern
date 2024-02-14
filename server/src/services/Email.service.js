const nodemailer = require("nodemailer");
const pug = require("pug");

class Email {
  constructor(user, url) {
    this.from = `Đoàn Minh Quyền <${process.env.MAIL_USER}>`;
    this.to = user.changeEmailTo ?? user.email;
    this.name = user.fullName;
    this.username = user.username;
    this.url = url;
  }

  createTransport() {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      fullName: this.name,
      username: this.username,
      url: this.url,
      subject,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html,
    };

    await this.createTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Chào mừng bạn tới Web Bán sách");
  }

  async sendUpdateEmail() {
    await this.send("updateEmail", "Yêu cầu thay đổi địa chỉ email");
  }

  async sendForgot() {
    await this.send("forgot", "Yêu cầu lấy lại thông tin tài khoản");
  }
}

module.exports = Email;
