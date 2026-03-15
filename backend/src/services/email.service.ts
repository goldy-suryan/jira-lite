import { transporter } from '../config/email.config.js';

export const sendEmailInvitation = async (
  email: string,
  projectName: string,
  inviteLink: string,
) => {
  transporter.sendMail({
    from: `"JIRA LITE" ${process.env.MAIL_USER}`,
    to: email,
    subject: `Invitation to join ${projectName}`,
    html: `
      <h2>You have been invited to join ${projectName}</h2>
      <p>Click the link below to accept the invitation:</p>
      <a href="${inviteLink}">Accept Invitation</a>
    `,
  });
};
