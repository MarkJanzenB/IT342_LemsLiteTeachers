package edu.cit.lemslite.Repository;

import edu.cit.lemslite.Entity.TeacherScheduleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeacherScheduleRepository extends JpaRepository<TeacherScheduleEntity, Integer> {

}
