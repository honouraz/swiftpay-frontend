import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendReceiptEmail = async (to: string, reference: string, pdfBuffer: Buffer) => {
  try {
    const info = await transporter.sendMail({
      from: `"SwiftPay" <${process.env.EMAIL_USER}>`,
      to,
      subject: `SwiftPay Receipt - ${reference}`,
      text: `Thank you for your using SWIFTPAYNG  for your dues payment!\n\nYour receipt is attached.\nReference: ${reference}`,
      attachments: [
        {
          filename: `receipt-${reference}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    console.log('Receipt email sent:', info.messageId);
  } catch (err) {
    console.error('Email send failed:', err);
    // Don't throw — we don't want to fail the payment flow
  }
};