package edu.cit.lemslite.Controller;

import edu.cit.lemslite.DTO.BatchReturnRequestDTO;
import edu.cit.lemslite.Entity.BatchReturnEntity;
import edu.cit.lemslite.Service.BatchReturnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/batchreturn")
@CrossOrigin(origins = "https://lems-lite.vercel.app")
public class BatchReturnController {

    @Autowired
    private BatchReturnService batchReturnService;

    @PostMapping("/add")
    public void addBatchReturn(@RequestParam int uid, @RequestBody BatchReturnRequestDTO request) {
        String referenceCode = request.getReferenceCode();
        Map<Integer, String> itemStatuses = request.getItemStatuses();
        
        batchReturnService.addBatchReturn(uid, referenceCode, itemStatuses);
    }

    @GetMapping("/all")
    public List<BatchReturnEntity> getAllBatchReturns() {
        return batchReturnService.getAllBatchReturns();
    }
}