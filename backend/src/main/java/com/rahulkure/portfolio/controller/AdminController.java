package com.rahulkure.portfolio.controller;

import com.rahulkure.portfolio.dto.DashboardStatsDto;
import com.rahulkure.portfolio.dto.InquiryAdminDto;
import com.rahulkure.portfolio.dto.InquiryPatchRequest;
import com.rahulkure.portfolio.entity.Project;
import com.rahulkure.portfolio.entity.Skill;
import com.rahulkure.portfolio.repository.InquiryRepository;
import com.rahulkure.portfolio.repository.ProjectRepository;
import com.rahulkure.portfolio.repository.SkillRepository;
import com.rahulkure.portfolio.service.AnalyticsService;
import com.rahulkure.portfolio.service.InquiryAdminService;
import com.rahulkure.portfolio.service.ResumeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AnalyticsService analyticsService;
    private final InquiryRepository inquiryRepo;
    private final ProjectRepository projectRepo;
    private final SkillRepository skillRepo;
    private final InquiryAdminService inquiryAdminService;
    private final ResumeService resumeService;

    public AdminController(
            AnalyticsService analyticsService,
            InquiryRepository inquiryRepo,
            ProjectRepository projectRepo,
            SkillRepository skillRepo,
            InquiryAdminService inquiryAdminService,
            ResumeService resumeService
    ) {
        this.analyticsService = analyticsService;
        this.inquiryRepo = inquiryRepo;
        this.projectRepo = projectRepo;
        this.skillRepo = skillRepo;
        this.inquiryAdminService = inquiryAdminService;
        this.resumeService = resumeService;
    }

    @GetMapping("/dashboard/stats")
    public DashboardStatsDto stats() {
        return new DashboardStatsDto(
                analyticsService.countVisits(),
                inquiryRepo.count(),
                projectRepo.count(),
                analyticsService.countResumeDownloads()
        );
    }

    @GetMapping("/inquiries")
    public List<InquiryAdminDto> inquiries() {
        return inquiryAdminService.list();
    }

    @PatchMapping("/inquiries/{id}")
    public InquiryAdminDto patchInquiry(@PathVariable Long id, @RequestBody InquiryPatchRequest body) {
        return inquiryAdminService.patch(id, body);
    }

    @DeleteMapping("/inquiries/{id}")
    public void deleteInquiry(@PathVariable Long id) {
        inquiryAdminService.delete(id);
    }

    @GetMapping("/projects")
    public List<Project> projects() {
        return projectRepo.findAllByOrderByDisplayOrderAscIdAsc();
    }

    @PostMapping("/projects")
    public Project createProject(@RequestBody Project body) {
        if (projectRepo.existsBySlugIgnoreCase(body.getSlug())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Slug already exists");
        }
        body.setId(null);
        return projectRepo.save(body);
    }

    @PutMapping("/projects/{id}")
    public Project updateProject(@PathVariable Long id, @RequestBody Project body) {
        Project existing = projectRepo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        existing.setTitle(body.getTitle());
        existing.setSlug(body.getSlug());
        existing.setSummary(body.getSummary());
        existing.setTechStack(body.getTechStack());
        existing.setFeatures(body.getFeatures());
        existing.setGithubUrl(body.getGithubUrl());
        existing.setDemoUrl(body.getDemoUrl());
        existing.setDisplayOrder(body.getDisplayOrder());
        existing.setImageUrl(body.getImageUrl());
        existing.setImageName(body.getImageName());
        return projectRepo.save(existing);
    }

    @DeleteMapping("/projects/{id}")
    public void deleteProject(@PathVariable Long id) {
        projectRepo.deleteById(id);
    }

    @PostMapping("/projects/upload-image")
    public ResponseEntity<?> uploadImage(
            @RequestParam("file") MultipartFile file
    ) throws Exception {

        String uploadDir = "uploads/projects/";

        File dir = new File(uploadDir);

        if (!dir.exists()) {
            dir.mkdirs();
        }

        String fileName = System.currentTimeMillis()
                + "_"
                + file.getOriginalFilename();

        Path path = Paths.get(uploadDir + fileName);

        Files.write(path, file.getBytes());

        String imageUrl = "http://localhost:8080/uploads/projects/" + fileName;

        return ResponseEntity.ok(imageUrl);
    }

    @GetMapping("/skills")
    public List<Skill> skills() {
        return skillRepo.findAllByOrderByCategoryAscDisplayOrderAsc();
    }

    @PostMapping("/skills")
    public Skill createSkill(@RequestBody Skill body) {
        body.setId(null);
        return skillRepo.save(body);
    }

    @PutMapping("/skills/{id}")
    public Skill updateSkill(@PathVariable Long id, @RequestBody Skill body) {
        Skill existing = skillRepo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        existing.setName(body.getName());
        existing.setCategory(body.getCategory());
        existing.setDisplayOrder(body.getDisplayOrder());
        return skillRepo.save(existing);
    }

    @DeleteMapping("/skills/{id}")
    public void deleteSkill(@PathVariable Long id) {
        skillRepo.deleteById(id);
    }

    @PostMapping("/resume/upload")
    public void uploadResume(@RequestParam("file") MultipartFile file) throws IOException {
        resumeService.replaceResume(file);
    }
}
