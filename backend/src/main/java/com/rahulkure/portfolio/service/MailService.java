package com.rahulkure.portfolio.service;

import com.rahulkure.portfolio.config.PortfolioProperties;
import com.rahulkure.portfolio.entity.ContactMessage;
import com.rahulkure.portfolio.entity.Inquiry;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private final JavaMailSender mailSender;
    private final PortfolioProperties props;

    public MailService(JavaMailSender mailSender, PortfolioProperties props) {
        this.mailSender = mailSender;
        this.props = props;
    }

    @Async
    public void notifyAdminNewInquiry(ContactMessage msg) {
        String adminEmail = props.getAdmin().getEmail();
        if (adminEmail == null || adminEmail.isBlank()) {
            return;
        }
        SimpleMailMessage m = new SimpleMailMessage();
        m.setTo(adminEmail);
        m.setSubject("[Portfolio] New inquiry: " + msg.getSubject());
        m.setText(buildAdminBody(msg));
        mailSender.send(m);
    }

    @Async
    public void sendAutoReply(ContactMessage msg) {
        SimpleMailMessage m = new SimpleMailMessage();
        m.setTo(msg.getEmail());
        m.setSubject("Thank you for contacting Rahul Kure");
        m.setText("Thank you for contacting Rahul Kure. Your message has been received successfully. I will get back to you soon.");
        mailSender.send(m);
    }

    @Async
    public void sendInquiryStatusUpdate(Inquiry inquiry) {
        ContactMessage contact = inquiry.getContactMessage();

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(contact.getEmail());
            helper.setSubject("Portfolio Inquiry Status Update - Ticket #" + inquiry.getId());

            String statusMessage = switch (inquiry.getStatus()) {
                case NEW -> "Your inquiry has been received.";
                case IN_PROGRESS -> "Your inquiry is currently in progress.";
                case CLOSED -> "Your inquiry has been completed successfully.";
                case SPAM -> "Your inquiry was marked as spam.";
            };

            String adminNotesHtml = "";
            if (inquiry.getAdminNotes() != null && !inquiry.getAdminNotes().isBlank()) {
                adminNotesHtml = "<div style=\"background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin-top: 20px; margin-bottom: 20px;\">" +
                                 "<strong>Admin Notes:</strong><br/>" +
                                 inquiry.getAdminNotes().replace("\n", "<br/>") +
                                 "</div>";
            }

            String htmlMsg = "<div style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #333;\">" +
                             "<h2>Hello " + contact.getFullName() + ",</h2>" +
                             "<p><strong>Ticket ID: #" + inquiry.getId() + "</strong></p>" +
                             "<p>" + statusMessage + "</p>" +
                             adminNotesHtml +
                             "<p>Estimated Response Time: <strong>24-48 Business Hours</strong></p>" +
                             "<p>Thank you for contacting us.</p>" +
                             "<p>Regards,<br/><strong>Rahul Kure</strong></p>" +
                             "<hr style=\"border: none; border-top: 1px solid #eee;\" />" +
                             "<p style=\"font-size: 12px; color: #999;\">This is an automated tracking email. Please do not reply directly to this message.</p>" +
                             "</div>";

            helper.setText(htmlMsg, true);
            mailSender.send(message);
        } catch (Exception e) {
            System.out.println("Failed to send HTML email.");
            e.printStackTrace();
        }
    }

    private String buildAdminBody(ContactMessage msg) {
        return """
                New portfolio inquiry received.

                Name: %s
                Email: %s
                Phone: %s
                Subject: %s
                Budget: %s
                Service: %s

                Message:
                %s
                """.formatted(
                msg.getFullName(),
                msg.getEmail(),
                msg.getPhone(),
                msg.getSubject(),
                msg.getBudget(),
                msg.getServiceType(),
                msg.getMessage()
        );
    }
}
