package edu.cit.lemslite.Controller;

import edu.cit.lemslite.Entity.TransactionHistory;
import edu.cit.lemslite.Service.TransactionHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/transactionhistory")
@CrossOrigin(origins = "https://lems-lite.vercel.app")
public class TransactionHistoryController {

    @Autowired
    private TransactionHistoryService transactionHistoryService;

    // Get all transaction histories
    @GetMapping
    public ResponseEntity<List<TransactionHistory>> getAllTransactionHistories() {
        List<TransactionHistory> histories = transactionHistoryService.getAllTransactionHistories();
        return ResponseEntity.ok(histories);
    }

}
