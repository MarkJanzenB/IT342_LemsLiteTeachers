package edu.cit.lemslite.Service;

import edu.cit.lemslite.Entity.BatchResupplyEntity;
import edu.cit.lemslite.Entity.UserEntity;
import edu.cit.lemslite.Repository.BatchResupplyRepository;
import edu.cit.lemslite.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BatchResupplyService {

    @Autowired
    private BatchResupplyRepository batchResupplyRepository;
    
    @Autowired
    UserRepository userrepo;

    public BatchResupplyEntity addBatchResupply(BatchResupplyEntity batchResupply) {
    	UserEntity user = userrepo.findById(batchResupply.getAddedBy().getUid()).orElse(null);
    	batchResupply.setAddedBy(user);
        return batchResupplyRepository.save(batchResupply);
    }

    public List<BatchResupplyEntity> getAllBatchResupplies() {
        return batchResupplyRepository.findAll();
    }
    
    public ResponseEntity<?> getByLocalDateAndAddedBy(LocalDate dateResupply, int userID){
    	UserEntity user = userrepo.findById(userID).orElse(null);
    	return ResponseEntity
    			.status(HttpStatus.OK)
    			.body(batchResupplyRepository.findByDateResupplyAndAddedBy(dateResupply, user));
    }
    
    public ResponseEntity<?> getAllDisctinct(){
    	return ResponseEntity
    			.status(HttpStatus.OK)
    			.body(batchResupplyRepository.findDistinctByDateResupplyAndAddedBy());
    }
}