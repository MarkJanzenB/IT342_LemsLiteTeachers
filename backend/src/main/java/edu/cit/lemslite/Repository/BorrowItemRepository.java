package edu.cit.lemslite.Repository;

import edu.cit.lemslite.Entity.BorrowItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BorrowItemRepository extends JpaRepository<BorrowItemEntity, Integer> {

    // ✅ Fetch borrow items by institution ID (instiId) with user details
//    @Query("SELECT b FROM BorrowItemEntity b JOIN FETCH b.user WHERE b.instiId = :instiId ORDER BY b.borrowedDate DESC")
//    List<BorrowItemEntity> findByInstiIdWithUser(@Param("instiId") String instiId);

    // ✅ Fetch borrow items by institution ID (without user details)
//    List<BorrowItemEntity> findByInstiId(String instiId);

    // ✅ Fetch borrow items by borrowed ID
    List<BorrowItemEntity> findByBorrowedId(String borrowedId);

    List<BorrowItemEntity> findByUser_UserId(int userId);

}
