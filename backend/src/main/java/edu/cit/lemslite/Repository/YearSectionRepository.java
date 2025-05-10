package edu.cit.lemslite.Repository;

import edu.cit.lemslite.Entity.YearSectionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface YearSectionRepository extends JpaRepository<YearSectionEntity, Integer> {
    // Find by year
    List<YearSectionEntity> findByYear(int year);

    // Find by section
    List<YearSectionEntity> findBySection(String section);

    // Find by yearsect
    YearSectionEntity findByYearsect(String yearsect);
}