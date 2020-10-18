import vars from "../../../config/vars";

const sendPasswordReset = async (user) => {
    // using Twilio SendGrid's v3 Node.js Library
    // https://github.com/sendgrid/sendgrid-nodejs
    // if (vars.env !== "production") return;

    try {
        // The provided authorization grant is invalid, expired, or revoked
        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(vars.sendgrid_api_key);
        const msg = {
            to: user.email,
            from: "portal@nodejs-api-boilerplate.app",
            subject: "Portal Mecânica - Alteração da sua Senha",
            text: `
                Link de ${
                    user.confirmed ? "redefinição" : "ativação"
                } da sua senha: ${
                vars.env === "production"
                    ? "https://nodejs-api-boilerplate.app"
                    : "http://localhost:8080"
            }/recuperar/${user.key}
            `,
            html: `Link de ${
                user.confirmed ? "redefinição" : "ativação"
            } da sua senha: ${
                vars.env === "production"
                    ? "https://nodejs-api-boilerplate.app"
                    : "http://localhost:8080"
            }/recuperar/${user.key}`,
        };
        sgMail.send(msg);

        return true;
    } catch (err) {
        return false;
    }
}

const sendResponseContact = async (user, response) => {
    // using Twilio SendGrid's v3 Node.js Library
    // https://github.com/sendgrid/sendgrid-nodejs
    // if (vars.env !== "production") return;

    try {
        // The provided authorization grant is invalid, expired, or revoked
        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(vars.sendgrid_api_key);
        const msg = {
            to: response.email,
            from: "portal@nodejs-api-boilerplate.app",
            subject: "Portal Mecânica - Retorno do seu Contato",
            text: response.content,
            html: response.content,
        };
        sgMail.send(msg);

        return true;
    } catch (err) {
        return false;
    }
}

export default { sendPasswordReset, sendResponseContact };