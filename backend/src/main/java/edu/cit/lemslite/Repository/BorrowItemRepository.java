package edu.cit.lemslite.Repository;

import edu.cit.lemslite.Entity.BorrowItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BorrowItemRepository extends JpaRepository<BorrowItemEntity, Integer> {

    List<BorrowItemEntity> findByBorrowedId(String borrowedId);

    List<BorrowItemEntity> findByUser_UserId(int userId);

}