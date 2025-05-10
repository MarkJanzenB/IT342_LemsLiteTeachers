package edu.cit.lemslite.Service;

import edu.cit.lemslite.Entity.InventoryEntity;
import edu.cit.lemslite.Entity.ItemCategoryEntity;
import edu.cit.lemslite.Repository.InventoryRepository;
import edu.cit.lemslite.Repository.ItemCategoryRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
@Service
public class InventoryService {
	@Autowired
	InventoryRepository inventoryRepository;
	
	@Autowired
	ItemCategoryRepository icrepo;

	public List<InventoryEntity> getAllInventory() {
		return inventoryRepository.findAll();
	}

	@Transactional
	public ResponseEntity<?> addInventory(List<InventoryEntity> inventoryArray) {
		List<InventoryEntity> inventoryToAdd = new ArrayList<>();
		for(InventoryEntity inventory: inventoryArray) {
			InventoryEntity inventoryfromdb = inventoryRepository.findByNameIgnoreCase(inventory.getName());
			ItemCategoryEntity itemCategory = icrepo.findById(inventory.getItemCategory().getCategoryId()).orElse(null);
			
			if (inventoryfromdb != null) {
				return ResponseEntity
						.status(HttpStatus.CONFLICT) // 409
						.body(inventory.getName() + " Inventory already exists");
			}
			inventory.setItemCategory(itemCategory);
			inventory.setStatus("Out of stock");
			
			inventoryToAdd.add(inventory);
		}
		return ResponseEntity
				.status(HttpStatus.CREATED) //201
				.body(inventoryRepository.saveAll(inventoryToAdd));
	}

	public List<InventoryEntity> getInventoryByCategory(int category_id) {
		return inventoryRepository.findByItemCategoryCategoryId(category_id);
	}

	public ResponseEntity<?> isInventoryExists(String inventoryName) {
		InventoryEntity inventoryFromDb = inventoryRepository.findByNameIgnoreCase(inventoryName);

		if (inventoryFromDb != null) {
			return ResponseEntity
					.status(HttpStatus.OK) // 200
					.body(inventoryName + " Exists in the database");
		}

		return ResponseEntity
				.status(HttpStatus.CONFLICT) // 409
				.body(inventoryName + " Does not exists in the database");
	}

	public ResponseEntity<?> deleteInventory(int id) {
		Optional<InventoryEntity> inventory = inventoryRepository.findById(id);
		if (inventory.isPresent()) {
			inventoryRepository.deleteById(id);
			return ResponseEntity
					.status(HttpStatus.OK) // 200
					.body(inventory);
		} else {
			return ResponseEntity
					.status(HttpStatus.NOT_FOUND) // 404
					.body(id + " Does not exists");
		}
	}

	@Transactional
	public ResponseEntity<?> updateInventory(int id, InventoryEntity inventoryToUpdate) {
		Optional<InventoryEntity> inventoryOptional = inventoryRepository.findById(id);
		if (inventoryOptional.isPresent()) {
			InventoryEntity inventory = inventoryOptional.get();

			if (inventoryToUpdate.getName() != null && !inventoryToUpdate.getName().isEmpty()) {
				InventoryEntity inventoryFromDb = inventoryRepository.findByNameIgnoreCase(inventoryToUpdate.getName());
				/*
				 * Cancels the udpate
				 * if the new name already exists
				 * */
				if (inventoryFromDb != null && inventoryFromDb.getInventoryId() != id) {
					return ResponseEntity
							.status(HttpStatus.CONFLICT) // 409
							.body("The name " + inventoryToUpdate.getName() + " already exists");
				}
				inventory.setName(inventoryToUpdate.getName());
			}

			if (inventoryToUpdate.getDescription() != null && !inventoryToUpdate.getDescription().isEmpty()) {
				inventory.setDescription(inventoryToUpdate.getDescription());
			}

			if (!Float.isNaN(inventoryToUpdate.getQuantity())) {
				inventory.setQuantity(inventoryToUpdate.getQuantity());
				if(inventoryToUpdate.getQuantity() > 0) {
					inventory.setStatus("Available");
				}else {
					inventory.setStatus("Out of stock");
				}
			}

			return ResponseEntity
					.status(HttpStatus.OK) // 200
					.body(inventoryRepository.save(inventory));
		} else {
			return ResponseEntity
					.status(HttpStatus.NOT_FOUND) // 404
					.body(id + " Does not exist");
		}
	}

	public InventoryEntity getInventoryByName(String itemName) {
		return inventoryRepository.findByNameIgnoreCase(itemName);
	}

}