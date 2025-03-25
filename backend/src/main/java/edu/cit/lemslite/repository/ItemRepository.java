package edu.cit.lemslite.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.cit.lemslite.entity.ItemEntity;

@Repository
public interface ItemRepository  extends JpaRepository<ItemEntity, Integer>{
	ItemEntity findByUniqueId (String uniqueId);
	ItemEntity findTopByIsAutoUidTrueOrderByItemIdDesc();
	List<ItemEntity> findByItemName(String itemName);
	List<ItemEntity> findByItemNameAndUserIsNullOrderByItemIdDesc(String itemName);
	List<ItemEntity> findByItemNameAndStatus(String itemName, String status);
	List<ItemEntity> findByItemNameAndBorrowCart_Id(String itemName, int borrowCartId);
}
