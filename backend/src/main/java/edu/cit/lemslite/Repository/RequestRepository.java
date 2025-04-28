package edu.cit.lemslite.Repository;

import edu.cit.lemslite.Entity.RequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<RequestEntity, Integer>{
	List<RequestEntity> findByStatus(String status);
	List<RequestEntity> findByTeacherUserId(int teacherId);
}
