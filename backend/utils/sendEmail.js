import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // Check if email credentials are provided
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.log('----------------------------------------------------');
        console.log('⚠️  SMTP Credentials missing. Mocking email send.');
        console.log(`📨 To: ${options.email}`);
        console.log(`📝 Subject: ${options.subject}`);
        console.log(`📄 Message: ${options.message}`);
        console.log('----------------------------------------------------');
        return; 
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // Define email options
    const mailOptions = {
        from: `Sabjiwala Support <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    // Send email
    await transporter.sendMail(mailOptions);
};

export default sendEmail;
