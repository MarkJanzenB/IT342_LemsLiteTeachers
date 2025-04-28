package edu.cit.lemslite.Repository;

import edu.cit.lemslite.Entity.TransactionHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionHistoryRepository extends JpaRepository<TransactionHistory, Integer> {
}
