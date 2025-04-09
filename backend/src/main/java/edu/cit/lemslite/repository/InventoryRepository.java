package edu.cit.lemslite.repository;

import edu.cit.lemslite.entity.InventoryEntity;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryRepository extends JpaRepository<InventoryEntity, Integer> {
	List<InventoryEntity> findByItemCategoryCategoryId(int categoryId);
	
	InventoryEntity findByNameIgnoreCase(String name);
}
