package com.rahulkure.portfolio.repository;

import com.rahulkure.portfolio.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findAllByOrderByCategoryAscDisplayOrderAsc();
}
