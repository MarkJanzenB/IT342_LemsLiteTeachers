package edu.cit.lemslite.Service;

import edu.cit.lemslite.Entity.ManufacturerEntity;
import edu.cit.lemslite.Repository.ManufacturerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class ManufacturerService {
	@Autowired
	ManufacturerRepository mrepo;
	
	public ResponseEntity<?> getAll(){
		return ResponseEntity
				.status(HttpStatus.OK)
				.body(mrepo.findAll());
	}
	
	public ResponseEntity<?> add(ManufacturerEntity newManu){
		return ResponseEntity
				.status(HttpStatus.OK)
				.body(mrepo.save(newManu));
	}
}
