package edu.cit.lemslite.Repository;

import edu.cit.lemslite.Entity.BatchResupplyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BatchResupplyRepository extends JpaRepository<BatchResupplyEntity, Integer> {
}