package edu.cit.lemslite.Repository;

import edu.cit.lemslite.Entity.BatchResupplyEntity;
import edu.cit.lemslite.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BatchResupplyRepository extends JpaRepository<BatchResupplyEntity, Integer> {
	
	List<BatchResupplyEntity> findByDateResupplyAndAddedBy(LocalDate dateResupply, UserEntity addedBy);
	@Query("SELECT DISTINCT br.dateResupply, br.addedBy FROM BatchResupplyEntity br")
	List<Object[]> findDistinctByDateResupplyAndAddedBy();
}