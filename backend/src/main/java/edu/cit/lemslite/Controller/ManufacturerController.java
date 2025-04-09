package edu.cit.lemslite.Controller;

import edu.cit.lemslite.Entity.ManufacturerEntity;
import edu.cit.lemslite.Service.ManufacturerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/manufacturer")
@CrossOrigin
public class ManufacturerController {
	@Autowired
	ManufacturerService mserv;
	
	@GetMapping("/getall")
	public ResponseEntity<?> getAll(){
		return mserv.getAll();
	}
	
	@PostMapping("/add")
	public ResponseEntity<?> add(@RequestBody ManufacturerEntity newManu){
		return mserv.add(newManu);
	}
}
