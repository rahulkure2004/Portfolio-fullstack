package com.rahulkure.portfolio.service;

import com.rahulkure.portfolio.config.PortfolioProperties;
import com.rahulkure.portfolio.dto.ResumeInfoDto;
import com.rahulkure.portfolio.entity.ResumeAsset;
import com.rahulkure.portfolio.repository.ResumeAssetRepository;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class ResumeService {

    private final ResumeAssetRepository resumeRepo;
    private final PortfolioProperties props;

    public ResumeService(ResumeAssetRepository resumeRepo, PortfolioProperties props) {
        this.resumeRepo = resumeRepo;
        this.props = props;
    }

    public ResumeInfoDto activeResumeInfo() {
        return resumeRepo.findFirstByActiveTrueOrderByUploadedAtDesc()
                .map(r -> new ResumeInfoDto(
                        r.getFileName(),
                        trimSlash(props.getPublicBaseUrl()) + "/api/public/resume/download"
                ))
                .orElse(null);
    }

    public Resource loadActiveFile() {
        ResumeAsset asset = resumeRepo.findFirstByActiveTrueOrderByUploadedAtDesc()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No resume uploaded yet."));
        try {
            Path path = Paths.get(asset.getStoragePath()).normalize();
            Resource resource = new UrlResource(path.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Resume file missing on disk.");
            }
            return resource;
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Resume file missing on disk.");
        }
    }

    @Transactional
    public void replaceResume(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Empty file.");
        }
        String original = file.getOriginalFilename();
        if (original == null || !original.toLowerCase().endsWith(".pdf")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only PDF resumes are accepted.");
        }
        Path dir = Paths.get(props.getUploadDir()).toAbsolutePath().normalize();
        Files.createDirectories(dir);
        String stored = UUID.randomUUID() + ".pdf";
        Path target = dir.resolve(stored);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        resumeRepo.findAll().forEach(r -> {
            r.setActive(false);
            resumeRepo.save(r);
        });

        ResumeAsset asset = new ResumeAsset();
        asset.setFileName(original);
        asset.setStoragePath(target.toString());
        asset.setActive(true);
        resumeRepo.save(asset);
    }

    private String trimSlash(String base) {
        if (base == null) {
            return "";
        }
        return base.endsWith("/") ? base.substring(0, base.length() - 1) : base;
    }
}
