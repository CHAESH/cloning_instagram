import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });

import { adjectives, nouns } from "./words";
import nodemailer from "nodemailer";
import mgTransport from "nodemailer-mailgun-transport";

export const generateSecret = () => {
  const randomNumber = Math.floor(Math.random() * adjectives.length);
  return `${adjectives[randomNumber]} ${nouns[randomNumber]}`;
};

const sendMail = (emailData) => {
  const auth = {
    auth: {
      api_key: process.env.MAILGUN_APIKEY,
      domain: process.env.MAILGUN_DOMAIN,
    },
  };
  const client = nodemailer.createTransport(mgTransport(auth));
  return client.sendMail(emailData);
};

export const sendSecretMail = (adress, secret) => {
  const emailData = {
    from: "csh1708@gmail.com",
    to: adress,
    subject: "🔒Login Secret for Prismagram",
    html: `Hello! Your login secret is <strong>${secret}</strong>. <br/>Copy paste on the app/website to log in`,
  };
  return sendMail(emailData);
};
