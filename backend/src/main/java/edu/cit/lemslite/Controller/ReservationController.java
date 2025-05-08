package edu.cit.lemslite.Controller;

import edu.cit.lemslite.Entity.ReservationEntity;
import edu.cit.lemslite.Service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservation")
@CrossOrigin(origins = "https://lems-lite.vercel.app/")
public class ReservationController {
	@Autowired
	ReservationService resserv;
	
	//for testing purposes
	@GetMapping("/message")
	public String message() {
		return "ReservationController is working";
	}
	
	//for adding reservation
	@PostMapping("/addreservation")
	public ReservationEntity addReservation(@RequestBody ReservationEntity reservation) {
		return resserv.addReservation(reservation);
	}
	
	//for getting all reservation data
	@GetMapping("/getallreservation")
	public List<ReservationEntity> getAllReservation(){
		return resserv.getAllReservation();
	}
}
