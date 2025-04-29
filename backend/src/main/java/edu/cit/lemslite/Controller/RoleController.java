package edu.cit.lemslite.Controller;

import edu.cit.lemslite.Entity.RoleEntity;
import edu.cit.lemslite.Service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/role")
@CrossOrigin(origins = "https://cit-lems.vercel.app")
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
