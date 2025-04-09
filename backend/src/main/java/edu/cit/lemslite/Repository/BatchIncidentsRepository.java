package edu.cit.lemslite.Repository;

import edu.cit.lemslite.Entity.BatchIncidentsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BatchIncidentsRepository extends JpaRepository<BatchIncidentsEntity, Integer> {
    List<BatchIncidentsEntity> findByBatchId(String batchId);
}