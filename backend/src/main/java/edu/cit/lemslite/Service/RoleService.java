package edu.cit.lemslite.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.cit.lemslite.Entity.RoleEntity;
import edu.cit.lemslite.Repository.RoleRepository;

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
