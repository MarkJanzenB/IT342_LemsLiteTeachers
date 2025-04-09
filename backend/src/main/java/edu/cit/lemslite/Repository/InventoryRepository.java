package edu.cit.lemslite.Repository;

import edu.cit.lemslite.Entity.InventoryEntity;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryRepository extends JpaRepository<InventoryEntity, Integer> {
	List<InventoryEntity> findByItemCategoryCategoryId(int categoryId);
	
	InventoryEntity findByNameIgnoreCase(String name);
}
