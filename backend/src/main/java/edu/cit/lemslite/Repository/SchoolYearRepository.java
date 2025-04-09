package edu.cit.lemslite.Repository;

import edu.cit.lemslite.Entity.SchoolYearEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SchoolYearRepository extends JpaRepository<SchoolYearEntity, Integer> {
}