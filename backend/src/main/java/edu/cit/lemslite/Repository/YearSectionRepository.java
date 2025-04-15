package edu.cit.lemslite.Repository;

import edu.cit.lemslite.Entity.YearSectionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface YearSectionRepository extends JpaRepository<YearSectionEntity, Integer> {
    // Custom finder methods

    // Find by year and section
    List<YearSectionEntity> findByYearAndSection(String year, String section);

}