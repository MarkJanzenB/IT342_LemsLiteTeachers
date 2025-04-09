package edu.cit.lemslite.Repository;

import edu.cit.lemslite.Entity.BatchReturnEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BatchReturnRepository extends JpaRepository<BatchReturnEntity, Integer> {
}