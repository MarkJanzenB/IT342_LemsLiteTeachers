package edu.cit.lemslite.Service;

import edu.cit.lemslite.Entity.BatchResupplyEntity;
import edu.cit.lemslite.Repository.BatchResupplyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BatchResupplyService {

    @Autowired
    private BatchResupplyRepository batchResupplyRepository;

    public BatchResupplyEntity addBatchResupply(BatchResupplyEntity batchResupply) {
        return batchResupplyRepository.save(batchResupply);
    }

    public List<BatchResupplyEntity> getAllBatchResupplies() {
        return batchResupplyRepository.findAll();
    }
}