package com.rahulkure.portfolio.service;

import com.rahulkure.portfolio.dto.ContactRequest;
import com.rahulkure.portfolio.entity.ContactMessage;
import com.rahulkure.portfolio.entity.Inquiry;
import com.rahulkure.portfolio.entity.InquiryStatus;
import com.rahulkure.portfolio.repository.ContactMessageRepository;
import com.rahulkure.portfolio.repository.InquiryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ContactService {

    private final ContactMessageRepository contactRepo;
    private final InquiryRepository inquiryRepo;
    private final CaptchaService captchaService;
    private final MailService mailService;

    public ContactService(
            ContactMessageRepository contactRepo,
            InquiryRepository inquiryRepo,
            CaptchaService captchaService,
            MailService mailService
    ) {
        this.contactRepo = contactRepo;
        this.inquiryRepo = inquiryRepo;
        this.captchaService = captchaService;
        this.mailService = mailService;
    }

    @Transactional
    public void handle(ContactRequest req) {

        // Honeypot spam protection
        if (req.website() != null && !req.website().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Spam detected."
            );
        }

        // CAPTCHA validation
        if (!captchaService.validate(
                req.captchaToken(),
                req.captchaAnswer()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid or expired CAPTCHA."
            );
        }

        // Save contact message
        ContactMessage msg = new ContactMessage();

        msg.setFullName(req.fullName().trim());
        msg.setEmail(req.email().trim());

        msg.setPhone(
                req.phone() == null
                        ? null
                        : req.phone().trim()
        );

        msg.setSubject(req.subject().trim());

        msg.setBudget(
                req.budget() == null
                        ? null
                        : req.budget().trim()
        );

        msg.setServiceType(req.serviceType().trim());

        msg.setMessage(req.message().trim());

        contactRepo.save(msg);

        // Create inquiry
        Inquiry inquiry = new Inquiry();

        inquiry.setContactMessage(msg);
        inquiry.setStatus(InquiryStatus.NEW);

        inquiryRepo.save(inquiry);

        // Send admin notification email
        try {
            mailService.notifyAdminNewInquiry(msg);
            System.out.println("Admin notification email sent successfully.");
        } catch (Exception ex) {

            System.out.println("Failed to send admin notification email.");

            ex.printStackTrace();
        }

        // Send auto reply email
        try {
            mailService.sendAutoReply(msg);

            System.out.println("Auto reply email sent successfully.");

        } catch (Exception ex) {

            System.out.println("Failed to send auto reply email.");

            ex.printStackTrace();
        }
    }
}