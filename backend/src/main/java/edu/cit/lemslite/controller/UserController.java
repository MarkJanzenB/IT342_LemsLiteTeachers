package com.capstone.LEMS.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.capstone.LEMS.Entity.UserEntity;
import com.capstone.LEMS.Service.UserService;

@RestController
@RequestMapping("/user")
public class UserController {
	@Autowired
	UserService userserv;
	
	@GetMapping("/message")
	public String testMessage() {
		return "UserController is working";
	}
	
	@PostMapping("/register")
	public UserEntity UserRegister(@RequestBody UserEntity user) {
		return userserv.UserRegister(user);
	}
	
	@PostMapping("/login")
	public String UserLogin(@RequestBody Map<String, String> loginDetails) {
	    String insti_id = loginDetails.get("insti_id");
	    String password = loginDetails.get("password");
	    return userserv.verify(insti_id, password);
	}

	
	@GetMapping("/getallusers")
	public List<UserEntity> getAllUser(){
		return userserv.getAllUsers();
	}
	
	@PutMapping("/tonotnew")
	public String notNew(@RequestBody Map<String, String> instiId) {
		String insti_id = instiId.get("insti_id");
		return userserv.notNew(insti_id);
	}
	
	@GetMapping("/isusernew")
	public boolean isUserNew(@RequestParam String instiId) {
		return userserv.isUserNew(instiId);
	}
	
	@GetMapping("/isuseralrdyexists")
	public boolean isUserAlrdyExists(@RequestParam String instiId) {
		return userserv.isUserAlrdyExists(instiId);
	}
	
	@GetMapping("/getuser")
	public ResponseEntity<?> getUserDetails(@RequestParam int uid){
		return userserv.getUserDetails(uid);
	}
	
	@GetMapping("/getallusersbyroleid")
	public ResponseEntity<?> getAllUsersByRoleId(@RequestParam int roleId){
		return userserv.getAllUsersByRoleId(roleId);
	}
	
	@PutMapping("/update")
	public ResponseEntity<?> updateUser(@RequestBody UserEntity newUserDetails){
		return userserv.updateUser(newUserDetails);
	}
}
