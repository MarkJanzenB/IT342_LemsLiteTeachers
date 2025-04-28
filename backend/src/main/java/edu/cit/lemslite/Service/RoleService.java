package edu.cit.lemslite.Service;

import edu.cit.lemslite.Entity.RoleEntity;
import edu.cit.lemslite.Repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {
	@Autowired
	RoleRepository rolerepo;
	
	//for adding roles
	public RoleEntity AddRole(RoleEntity role) {
		return rolerepo.save(role);
	}
	
	//get a list of all roles
	public List<RoleEntity> getAllRoles(){
		return rolerepo.findAll();
	}
}
