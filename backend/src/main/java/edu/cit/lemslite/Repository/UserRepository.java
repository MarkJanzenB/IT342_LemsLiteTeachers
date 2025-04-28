package edu.cit.lemslite.Repository;

import edu.cit.lemslite.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer>{
	UserEntity findByInstiId (String insti_id);
	List<UserEntity> findByRole_RoleId(int roleId);
}
