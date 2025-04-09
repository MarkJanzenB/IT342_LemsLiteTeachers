package edu.cit.lemslite.Service;

import edu.cit.lemslite.Entity.BatchReturnEntity;
import edu.cit.lemslite.Repository.BatchReturnRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BatchReturnService {

    @Autowired
    private BatchReturnRepository batchReturnRepository;

    public BatchReturnEntity addBatchReturn(BatchReturnEntity batchReturn) {
        return batchReturnRepository.save(batchReturn);
    }

    public List<BatchReturnEntity> getAllBatchReturns() {
        return batchReturnRepository.findAll();
    }
}