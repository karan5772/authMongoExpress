import nodemailer from "nodemailer";

const sendMail = async (email, token) => {

    try {
        
        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "f78450bb79f88c",
                pass: "a62c4bd972cc3f"
            }
        });
        
        const mailOption = {
            from: 'hi@demomailtrap.co',
            to: email,
            subject: "Verify your email", // Subject line
            text: `Please click on the following link: \n http://localhost:3000/api/v1/users/verify/${token}`,
        };
        await transport.sendMail(mailOption);
        return true;
    } catch (error) {
        console.log(`Can't send email \n err : ${error}`)
        return false;
    }        
}

export default sendMail;