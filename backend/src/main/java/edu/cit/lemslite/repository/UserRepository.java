package edu.cit.lemslite.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.cit.lemslite.entity.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer>{
	UserEntity findByInstiId (String insti_id);
	List<UserEntity> findByRole_RoleId(int roleId);
}
