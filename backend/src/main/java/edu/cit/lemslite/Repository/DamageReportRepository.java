package edu.cit.lemslite.Repository;

import edu.cit.lemslite.Entity.DamageReportEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DamageReportRepository extends JpaRepository<DamageReportEntity, Long> {
}