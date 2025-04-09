package edu.cit.lemslite.Controller;

import edu.cit.lemslite.Entity.BatchReturnEntity;
import edu.cit.lemslite.Service.BatchReturnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/batchreturn")
@CrossOrigin
public class BatchReturnController {

    @Autowired
    private BatchReturnService batchReturnService;

    @PostMapping("/add")
    public BatchReturnEntity addBatchReturn(@RequestBody BatchReturnEntity batchReturn) {
        return batchReturnService.addBatchReturn(batchReturn);
    }

    @GetMapping("/all")
    public List<BatchReturnEntity> getAllBatchReturns() {
        return batchReturnService.getAllBatchReturns();
    }
}