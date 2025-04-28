package edu.cit.lemslite.Repository;

import edu.cit.lemslite.Entity.BatchResupplyEntity;
import edu.cit.lemslite.Entity.ItemEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository  extends JpaRepository<ItemEntity, Integer>{
	ItemEntity findByUniqueId (String uniqueId);
	ItemEntity findTopByIsAutoUidTrueOrderByItemIdDesc();
	List<ItemEntity> findByItemName(String itemName);
	List<ItemEntity> findByItemNameAndUserIsNullOrderByItemIdDesc(String itemName);
	List<ItemEntity> findByItemNameAndStatus(String itemName, String status);
	List<ItemEntity> findByItemNameAndBorrowCart_Id(String itemName, int borrowCartId);
	List<ItemEntity> findByUniqueIdIn(List<String> uniqueIds);
	List<ItemEntity> findByBatchResupply(BatchResupplyEntity batchResupply);
	List<ItemEntity> findByItemNameAndIsAutoUidTrueAndStatus(String itemName, String status, Pageable pageable);
	List<ItemEntity> findByItemNameAndIsAutoUidFalseAndStatus(String itemName, String status, Pageable pageable);
	List<ItemEntity> findByPreparingItem_IdIn(List<Integer> preparingItemIds);
	List<ItemEntity> findByItemId(int itemId); // Add this method

	ItemEntity findByItemNameIgnoreCase(String itemName);

	// Add this method to the ItemRepository interface:
	@Query("SELECT DISTINCT i.variant FROM ItemEntity i WHERE i.itemName = ?1 AND i.status = 'Available'")
	List<String> findVariantsByItemName(String itemName);
}
