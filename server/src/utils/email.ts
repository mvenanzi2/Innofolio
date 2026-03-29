// Email service for password reset
// In production, integrate with SendGrid, AWS SES, or similar service

export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
  // Get frontend URL from environment variable
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;
  
  console.log('\n=================================');
  console.log('PASSWORD RESET EMAIL');
  console.log('=================================');
  console.log(`To: ${email}`);
  console.log(`Reset Link: ${resetLink}`);
  console.log('=================================\n');
  
  // TODO: In production, replace with actual email service
  // Example with SendGrid:
  // await sgMail.send({
  //   to: email,
  //   from: 'noreply@innofolio.app',
  //   subject: 'Reset Your Password',
  //   html: `Click <a href="${resetLink}">here</a> to reset your password.`
  // });
  
  return true;
};

export const sendGroupInvitationEmail = async (
  recipientEmail: string,
  senderName: string,
  groupName: string
) => {
  console.log('\n=================================');
  console.log('GROUP INVITATION EMAIL');
  console.log('=================================');
  console.log(`To: ${recipientEmail}`);
  console.log(`From: ${senderName}`);
  console.log(`Group: ${groupName}`);
  console.log(`Message: ${senderName} invited you to join ${groupName}`);
  console.log('=================================\n');
  
  return true;
};
