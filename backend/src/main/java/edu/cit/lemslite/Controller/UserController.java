package edu.cit.lemslite.Controller;

import edu.cit.lemslite.Entity.UserEntity;
import edu.cit.lemslite.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "https://cit-lems.vercel.app")
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
	
	@PutMapping("/editpfp")
	public ResponseEntity<?> editPfp(@RequestBody Map<String, Object> newPfpDetails){
		return userserv.editPfp(newPfpDetails);
	}

	@PutMapping("/updateName")
	public ResponseEntity<?> updateName(@RequestParam int uid, @RequestParam(required = false) String newFirstName, @RequestParam(required = false) String newLastName) {
		return userserv.updateName(uid, newFirstName, newLastName);
	}

	@PutMapping("/updateEmail")
	public ResponseEntity<?> updateEmail(@RequestParam int uid, @RequestParam String newEmail) {
		return userserv.updateEmail(uid, newEmail);
	}

	@PutMapping("/changePassword")
	public ResponseEntity<?> changePassword(@RequestParam int uid, @RequestParam String oldPassword, @RequestParam String newPassword) {
		return userserv.changePassword(uid, oldPassword, newPassword);
	}

}
