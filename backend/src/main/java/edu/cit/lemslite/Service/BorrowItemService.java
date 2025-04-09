package edu.cit.lemslite.Service;


import edu.cit.lemslite.Entity.BorrowItemEntity;
import edu.cit.lemslite.Repository.BorrowItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BorrowItemService {

    @Autowired
    private BorrowItemRepository borrowItemRepository;

    public List<BorrowItemEntity> getBorrowItemsByUid(int uid) {
        List<BorrowItemEntity> items = borrowItemRepository.findByUser_UserId(uid);
        System.out.println("Fetched items for uid " + uid + ": " + items);
        return items != null ? items : List.of();
    }




    public ResponseEntity<?> addBorrowItem(BorrowItemEntity borrowItemEntity) {
        try {
            BorrowItemEntity savedItem = borrowItemRepository.save(borrowItemEntity);
            return ResponseEntity.ok(savedItem);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to add borrow item.");
        }
    }

    public List<BorrowItemEntity> getAllBorrowItems() {
        return borrowItemRepository.findAll(); // Fetch all borrow items
    }

    public List<BorrowItemEntity> getAllItems() {
        return borrowItemRepository.findAll(); // Fetch all borrow items from DB
    }


    public void saveBorrowItem(BorrowItemEntity borrowItemEntity) {
        borrowItemRepository.save(borrowItemEntity);
    }


    @Transactional
    public boolean updateBorrowItemStatus(String borrowedId, String status) {
        List<BorrowItemEntity> items = borrowItemRepository.findByBorrowedId(borrowedId);
        if (items.isEmpty()) {
            return false; // Borrowed ID not found
        }

        for (BorrowItemEntity item : items) {
            item.setStatus(status);
        }
        borrowItemRepository.saveAll(items); // Save updated statuses in batch
        return true;
    }


    public void updateStatusByBorrowedId(String borrowedId, String status) {
        List<BorrowItemEntity> borrowItemEntities = borrowItemRepository.findByBorrowedId(borrowedId);
        for (BorrowItemEntity item : borrowItemEntities) {
            item.setStatus(status);
            borrowItemRepository.save(item);
        }
    }


}