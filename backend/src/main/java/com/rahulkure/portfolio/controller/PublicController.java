package com.rahulkure.portfolio.controller;

import com.rahulkure.portfolio.dto.*;
import com.rahulkure.portfolio.entity.Project;
import com.rahulkure.portfolio.entity.Skill;
import com.rahulkure.portfolio.entity.Testimonial;
import com.rahulkure.portfolio.repository.ProjectRepository;
import com.rahulkure.portfolio.repository.SkillRepository;
import com.rahulkure.portfolio.repository.TestimonialRepository;
import com.rahulkure.portfolio.service.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    private final CaptchaService captchaService;
    private final ContactService contactService;
    private final RateLimitService rateLimitService;
    private final AnalyticsService analyticsService;
    private final ProjectRepository projectRepo;
    private final SkillRepository skillRepo;
    private final TestimonialRepository testimonialRepo;
    private final ResumeService resumeService;

    public PublicController(
            CaptchaService captchaService,
            ContactService contactService,
            RateLimitService rateLimitService,
            AnalyticsService analyticsService,
            ProjectRepository projectRepo,
            SkillRepository skillRepo,
            TestimonialRepository testimonialRepo,
            ResumeService resumeService
    ) {
        this.captchaService = captchaService;
        this.contactService = contactService;
        this.rateLimitService = rateLimitService;
        this.analyticsService = analyticsService;
        this.projectRepo = projectRepo;
        this.skillRepo = skillRepo;
        this.testimonialRepo = testimonialRepo;
        this.resumeService = resumeService;
    }

    @GetMapping("/captcha")
    public CaptchaResponse captcha() {
        return captchaService.generate();
    }

    @PostMapping("/contact")
    public ResponseEntity<Void> contact(@Valid @RequestBody ContactRequest req, HttpServletRequest http) {
        rateLimitService.checkContact(clientKey(http));
        contactService.handle(req);
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/analytics/visit")
    public ResponseEntity<Void> visit(@RequestBody(required = false) AnalyticsRequest req) {
        analyticsService.recordVisit(req == null ? new AnalyticsRequest("", "", "") : req);
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/analytics/resume-download")
    public ResponseEntity<Void> resumeAnalytics(@RequestBody(required = false) AnalyticsRequest req) {
        analyticsService.recordResumeDownload(req == null ? new AnalyticsRequest("", "", "") : req);
        return ResponseEntity.accepted().build();
    }

    @GetMapping("/projects")
    public List<Project> projects() {
        return projectRepo.findAllByOrderByDisplayOrderAscIdAsc();
    }

    @GetMapping("/skills")
    public List<Skill> skills() {
        return skillRepo.findAllByOrderByCategoryAscDisplayOrderAsc();
    }

    @GetMapping("/testimonials")
    public List<Testimonial> testimonials() {
        return testimonialRepo.findAllByOrderByDisplayOrderAscIdAsc();
    }

    @GetMapping("/resume")
    public ResponseEntity<ResumeInfoDto> resumeMeta() {
        ResumeInfoDto dto = resumeService.activeResumeInfo();
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/resume/download")
    public ResponseEntity<Resource> resumeDownload(HttpServletRequest http) {
        analyticsService.recordResumeDownload(new AnalyticsRequest("/resume/download", http.getHeader("Referer"), null));
        Resource file = resumeService.loadActiveFile();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"Rahul-Kure-Resume.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(file);
    }

    private String clientKey(HttpServletRequest req) {
        String forwarded = req.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return req.getRemoteAddr();
    }
}
