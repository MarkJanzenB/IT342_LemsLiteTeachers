package edu.cit.lemslite.Controller;

import edu.cit.lemslite.Entity.RequestEntity;
import edu.cit.lemslite.Service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/request")
@CrossOrigin(origins = "https://lems-lite.vercel.app")
public class RequestController {
	@Autowired
	RequestService reqserv;
	
	@PostMapping("/addrequest")
	public ResponseEntity<?> addRequest(@RequestBody RequestEntity request){

		return reqserv.addRequest(request);
	}
	
	@GetMapping("/getrequests")
	public ResponseEntity<?> getRequests(){
		return reqserv.getRequests();
	}
	
	@PutMapping("/updaterequest")
	public ResponseEntity<?> updateRequest(@RequestParam int reqId, @RequestBody RequestEntity req){
		return reqserv.updateRequest(reqId, req);
	}
	@GetMapping("/getrequestbystatus")
	public ResponseEntity<?> getRequestByStatus(@RequestParam String status){
		return reqserv.getRequestByStatus(status);
	}
	
	@GetMapping("/teacher/{teacherId}")
	public ResponseEntity<?> getRequestByTeacherId(@PathVariable int teacherId){
		return reqserv.getRequestsByTeacherId(teacherId);
	}
}
