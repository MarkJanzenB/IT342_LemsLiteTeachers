package edu.cit.lemslite.Controller;

import edu.cit.lemslite.Entity.BatchResupplyEntity;
import edu.cit.lemslite.Service.BatchResupplyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/batchresupply")
@CrossOrigin
public class BatchResupplyController {

    @Autowired
    private BatchResupplyService batchResupplyService;

    @PostMapping("/add")
    public BatchResupplyEntity addBatchResupply(@RequestBody BatchResupplyEntity batchResupply) {
        return batchResupplyService.addBatchResupply(batchResupply);
    }

    @GetMapping("/all")
    public List<BatchResupplyEntity> getAllBatchResupplies() {
        return batchResupplyService.getAllBatchResupplies();
    }
}