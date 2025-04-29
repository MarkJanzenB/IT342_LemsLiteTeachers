package edu.cit.lemslite.Service;

import edu.cit.lemslite.Entity.TransactionHistory;
import edu.cit.lemslite.Repository.TransactionHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionHistoryService {

    @Autowired
    private TransactionHistoryRepository transactionHistoryRepository;

    public TransactionHistory saveTransactionHistory(TransactionHistory transactionHistory) {
        return transactionHistoryRepository.save(transactionHistory);
    }

    public List<TransactionHistory> getAllTransactionHistories() {
        return transactionHistoryRepository.findAll();
    }
}
