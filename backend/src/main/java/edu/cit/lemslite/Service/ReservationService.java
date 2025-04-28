package edu.cit.lemslite.Service;

import edu.cit.lemslite.Entity.ReservationEntity;
import edu.cit.lemslite.Repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {
	@Autowired
	ReservationRepository resrepo;
	
	public ReservationEntity addReservation(ReservationEntity reservation) {
		return resrepo.save(reservation);
	}
	
	public List<ReservationEntity> getAllReservation(){
		return resrepo.findAll();
	}
}
