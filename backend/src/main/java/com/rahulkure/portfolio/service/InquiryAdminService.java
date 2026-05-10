package com.rahulkure.portfolio.service;

import com.rahulkure.portfolio.dto.InquiryAdminDto;
import com.rahulkure.portfolio.dto.InquiryPatchRequest;
import com.rahulkure.portfolio.entity.ContactMessage;
import com.rahulkure.portfolio.entity.Inquiry;
import com.rahulkure.portfolio.repository.ContactMessageRepository;
import com.rahulkure.portfolio.repository.InquiryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
public class InquiryAdminService {

    private final InquiryRepository inquiryRepo;
    private final ContactMessageRepository contactRepo;
    private final MailService mailService;

    public InquiryAdminService(InquiryRepository inquiryRepo, ContactMessageRepository contactRepo, MailService mailService) {
        this.inquiryRepo = inquiryRepo;
        this.contactRepo = contactRepo;
        this.mailService = mailService;
    }

    @Transactional(readOnly = true)
    public List<InquiryAdminDto> list() {
        return inquiryRepo.findAllByOrderByCreatedAtDesc().stream().map(this::map).toList();
    }

    @Transactional
    public InquiryAdminDto patch(Long id, InquiryPatchRequest req) {
        Inquiry inq = inquiryRepo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        
        boolean statusChanged = false;
        if (req.status() != null && req.status() != inq.getStatus()) {
            inq.setStatus(req.status());
            statusChanged = true;
        }
        if (req.adminNotes() != null) {
            inq.setAdminNotes(req.adminNotes());
        }
        inq.setUpdatedAt(Instant.now());
        Inquiry updatedInquiry = inquiryRepo.save(inq);

        if (statusChanged) {
            try {
                mailService.sendInquiryStatusUpdate(updatedInquiry);
                System.out.println("Status update email sent successfully.");
            } catch (Exception ex) {
                System.out.println("Failed to send inquiry status email.");
                ex.printStackTrace();
            }
        }
        
        return map(updatedInquiry);
    }

    @Transactional
    public void delete(Long id) {
        Inquiry inq = inquiryRepo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        ContactMessage cm = inq.getContactMessage();
        inquiryRepo.delete(inq);
        contactRepo.delete(cm);
    }

    private InquiryAdminDto map(Inquiry inq) {
        ContactMessage m = inq.getContactMessage();
        return new InquiryAdminDto(
                inq.getId(),
                m.getFullName(),
                m.getEmail(),
                m.getPhone(),
                m.getSubject(),
                m.getBudget(),
                m.getServiceType(),
                m.getMessage(),
                inq.getStatus(),
                inq.getAdminNotes(),
                inq.getCreatedAt(),
                inq.getUpdatedAt()
        );
    }
}
