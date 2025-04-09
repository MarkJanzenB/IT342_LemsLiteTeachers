package edu.cit.lemslite.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.lemslite.entity.RoleEntity;
import edu.cit.lemslite.service.RoleService;

@RestController
@RequestMapping("/role")
@CrossOrigin
public class RoleController {
	@Autowired
	RoleService roleserv;
	
	@GetMapping("/message")
	public String testMessage() {
		return "RoleController is working";
	}
	
	@PostMapping("/addrole")
	public RoleEntity addRole(@RequestBody RoleEntity role) {
		return roleserv.AddRole(role);
	}
	
	@GetMapping("/getallrole")
	public List<RoleEntity> getAllRoles(){
		return roleserv.getAllRoles();
	}
}
