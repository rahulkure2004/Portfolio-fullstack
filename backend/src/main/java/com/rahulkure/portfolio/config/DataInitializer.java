package com.rahulkure.portfolio.config;

import com.rahulkure.portfolio.entity.*;
import com.rahulkure.portfolio.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final AdminUserRepository adminRepo;
    private final ProjectRepository projectRepo;
    private final SkillRepository skillRepo;
    private final TestimonialRepository testimonialRepo;
    private final PortfolioProperties props;
    private final PasswordEncoder encoder;

    public DataInitializer(
            AdminUserRepository adminRepo,
            ProjectRepository projectRepo,
            SkillRepository skillRepo,
            TestimonialRepository testimonialRepo,
            PortfolioProperties props,
            PasswordEncoder encoder
    ) {
        this.adminRepo = adminRepo;
        this.projectRepo = projectRepo;
        this.skillRepo = skillRepo;
        this.testimonialRepo = testimonialRepo;
        this.props = props;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        if (adminRepo.count() == 0) {
            AdminUser admin = new AdminUser();
            admin.setUsername(props.getAdmin().getUsername());
            admin.setPasswordHash(encoder.encode(props.getAdmin().getPassword()));
            admin.setEmail(props.getAdmin().getEmail());
            adminRepo.save(admin);
        }

        if (projectRepo.count() == 0) {
            seedProjects();
        }
        if (skillRepo.count() == 0) {
            seedSkills();
        }
        if (testimonialRepo.count() == 0) {
            seedTestimonials();
        }
    }

    private void seedProjects() {
        addProject(
                "Multilingual Cyberbullying Detection",
                "cyberbullying-detection",
                "AI-powered cyberbullying detection system for Hindi, English, and Hinglish comments using NLP and Deep Learning.",
                "Python, TensorFlow, NLP, Flask",
                "Toxic comment detection|Emotion analysis|Multilingual support|Real-time predictions",
                1
        );
        addProject(
                "AI Waste Segregation Education Portal",
                "waste-segregation",
                "AI-powered waste classification portal using CNN image classification.",
                "React, TensorFlow, Python, Flask",
                "Dry/wet waste detection|Educational awareness|AI image classification",
                2
        );
        addProject(
                "Online Book Shop Management System",
                "book-shop",
                "Full stack e-commerce web application.",
                "HTML, CSS, JavaScript, PHP, MySQL",
                "User authentication|Cart system|Admin dashboard|Order management",
                3
        );
        addProject(
                "Doctor Appointment Booking System",
                "doctor-appointment",
                "MERN stack healthcare booking platform.",
                "MongoDB, Express.js, React.js, Node.js",
                "Appointment booking|Doctor management|Authentication system",
                4
        );
        addProject(
                "Government Scheme Recommender",
                "scheme-recommender",
                "AI-assisted government scheme recommendation platform.",
                "Java, Spring Boot, Angular, PostgreSQL",
                "Smart recommendations|Eligibility matching|User dashboard",
                5
        );
    }

    private void addProject(String title, String slug, String summary, String tech, String features, int order) {
        Project p = new Project();
        p.setTitle(title);
        p.setSlug(slug);
        p.setSummary(summary);
        p.setTechStack(tech);
        p.setFeatures(features);
        p.setGithubUrl("https://github.com/");
        p.setDemoUrl("https://example.com");
        p.setDisplayOrder(order);
        projectRepo.save(p);
    }

    private void seedSkills() {
        String[][] data = {
                {"HTML5", "Frontend"}, {"CSS3", "Frontend"}, {"JavaScript", "Frontend"},
                {"React.js", "Frontend"}, {"Tailwind CSS", "Frontend"}, {"Bootstrap", "Frontend"},
                {"Framer Motion", "Frontend"}, {"GSAP", "Frontend"}, {"Three.js", "Frontend"},
                {"Java", "Backend"}, {"Spring Boot", "Backend"}, {"REST APIs", "Backend"},
                {"Spring Security", "Backend"}, {"JWT Authentication", "Backend"},
                {"MySQL", "Database"}, {"PostgreSQL", "Database"}, {"MongoDB", "Database"},
                {"Python", "AI / ML"}, {"TensorFlow", "AI / ML"}, {"NLP", "AI / ML"},
                {"Deep Learning", "AI / ML"}, {"Machine Learning", "AI / ML"},
                {"Git & GitHub", "Other"}, {"Firebase", "Other"}, {"Linux", "Other"},
                {"Problem Solving", "Other"}, {"Data Structures", "Other"},
        };
        int i = 0;
        for (String[] row : data) {
            Skill s = new Skill();
            s.setName(row[0]);
            s.setCategory(row[1]);
            s.setDisplayOrder(i++);
            skillRepo.save(s);
        }
    }

    private void seedTestimonials() {
        addTestimonial(
                "Rahul delivered a professional and modern website with excellent functionality.",
                "Client",
                "Startup founder",
                1
        );
        addTestimonial(
                "Great communication and high-quality development work.",
                "Client",
                "Product lead",
                2
        );
        addTestimonial(
                "Highly recommended for full stack and AI-based projects.",
                "Client",
                "Tech recruiter",
                3
        );
    }

    private void addTestimonial(String quote, String author, String role, int order) {
        Testimonial t = new Testimonial();
        t.setQuote(quote);
        t.setAuthorName(author);
        t.setAuthorRole(role);
        t.setDisplayOrder(order);
        testimonialRepo.save(t);
    }
}
