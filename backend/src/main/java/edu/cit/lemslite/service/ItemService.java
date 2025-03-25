package edu.cit.lemslite.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import edu.cit.lemslite.entity.InventoryEntity;
import edu.cit.lemslite.entity.ItemEntity;
import edu.cit.lemslite.entity.UserEntity;
import edu.cit.lemslite.repository.InventoryRepository;
import edu.cit.lemslite.repository.ItemRepository;
import edu.cit.lemslite.repository.UserRepository;

@Service
public class ItemService {
	private static final Logger log = LoggerFactory.getLogger(ItemService.class);
    @Autowired
    ItemRepository itemrepo;

    @Autowired
    UserRepository userrepo;

    @Autowired
    InventoryRepository invrepo;


    //Transactional is used when something goes wrong in this method, the items would not be added
    @Transactional
    public ResponseEntity<?> AddItem(ItemEntity item, int bulkSize) {
    	// Prevents adding of items when bulk size is zero or less
    	if(bulkSize <= 0) {
    		return ResponseEntity
    				.status(HttpStatus.BAD_REQUEST) // 400
    				.body("Invalid bulk size. It must be greater than zero");
    	}
    	
    	// Prevents adding of items when an Item with the same unique id already exists
    	ItemEntity itemfromdb = itemrepo.findByUniqueId(item.getUniqueId());
    	if(itemfromdb != null) {
    		return ResponseEntity
    				.status(HttpStatus.CONFLICT) // 409
    				.body("Item with "+item.getUniqueId()+" unique ID already exists");
    	}
    	
    	// Creation of adding items
    	List<ItemEntity> itemsToSave = new ArrayList<>();
    	for(int i = 1; i <= bulkSize; i++) {
    		ItemEntity newItem = new ItemEntity();
    		newItem.setItemName(item.getItemName());
    		newItem.setInventory(item.getInventory());
    		newItem.setUniqueId(item.getUniqueId());
    		newItem.setUser(item.getUser()); // for testing purposes
    		newItem.setStatus("Available");
    		
    		// Generates a unique ID if it is not specifically provided
//    		if(newItem.getUniqueId() == null || item.getUniqueId().isBlank()) {
//        		String prefix = item.getItemName().substring(0, 2).toUpperCase()
//        				+ item.getItemName().substring(item.getItemName().length() - 1).toUpperCase();
//        		int nextNumber = idcountserv.getNextId() + i;
//        		String uniqueId = prefix + String.format("%04d", nextNumber);
//        		newItem.setUniqueId(uniqueId);
//        		newItem.setAutoUid(true);
//        	}
//
    		// Saving items to database
    		itemsToSave.add(newItem);
    	}
    	List<ItemEntity> savedItems = itemrepo.saveAll(itemsToSave);
        return ResponseEntity
        		.status(HttpStatus.CREATED) // 201
        		.body(savedItems);
    }
    
    public ResponseEntity<?> updateItems(String itemToEdit, ItemEntity newItemDetails){
    	log.info("Starting updateItems for itemToEdit: {}", itemToEdit);
    	
    	// Important learnings: trim() removes whitespace on both sides of a string
    	// Prevents updating of items if item name is blank
    	if(newItemDetails.getItemName() == null || newItemDetails.getItemName().trim().isEmpty()) {
    		log.warn("Validation failed: newItemDetails.getItemName() is blank or null");
    		return ResponseEntity
    				.status(HttpStatus.BAD_REQUEST) // 400
    				.body("Blank item name is not allowed.");
    	}
    	
    	// Gets the list of items with the name provided
    	log.info("Fetching items with name: {}", itemToEdit);
    	List<ItemEntity> items = itemrepo.findByItemName(itemToEdit);
    	
    	// Review before deleting this code
//    	if(items.isEmpty()) {
//    		log.warn("No items found with name: {}", itemToEdit);
//    		return ResponseEntity
//    				.status(HttpStatus.NOT_FOUND) // 404
//    				.body("No items found with name: " + itemToEdit);
//    	}
    	
    	
    	// Changed all of the item's names
    	log.info("Updating items with new name: {}", newItemDetails.getItemName());
    	items.forEach(item -> {
    		item.setItemName(newItemDetails.getItemName());
    	});
    	log.info("Saving updated items to the database");
    	List<ItemEntity> updatedItems = itemrepo.saveAll(items);
    	log.info("Successfully updated {} items", updatedItems.size());
    	return ResponseEntity
    			.status(HttpStatus.OK) // 200
    			.body(updatedItems);
    }
    
    public ResponseEntity<?> deleteItems(int bulkSize, ItemEntity itemsToDelete){
    	// Prevents deletion of items when there is no item name provided
    	if(itemsToDelete.getItemName() == null || itemsToDelete.getItemName().trim().isEmpty()) {
    		log.warn("Validation failed: itemsToDelete.getItemName() is blank or null");
    		return ResponseEntity
    				.status(HttpStatus.BAD_REQUEST) // 400
    				.body("Blank item name is not allowed.");
    	}
    	
    	
    	// Finds a list of items by item name and that are not being borrowed by a user
    	log.info("Fetching items with name: {}", itemsToDelete.getItemName());
    	List<ItemEntity> items = itemrepo.findByItemNameAndUserIsNullOrderByItemIdDesc(itemsToDelete.getItemName());
    	
    	// Prevents deletion of items when there is no item with the name provided
    	if(items.isEmpty()) {
    		log.warn("No items found with name: {}", itemsToDelete.getItemName());
    		return ResponseEntity
    				.status(HttpStatus.NOT_FOUND) // 404
    				.body("No items with name: " + itemsToDelete.getItemName());
    	}
    	
    	// Prevents deletion of items when items that are available to delete is lesser than the number of items that needs to be deleted
    	if(items.size() < bulkSize) {
    		log.warn("Attempting to delete more items than available or attempting to delete items that are used by a group");
    		return ResponseEntity
    				.status(HttpStatus.BAD_REQUEST) // 400
    				.body("Cannot delete items more than the available or that some items are currently in used by a group");
    	}
    	
    	
    	// Deletes items starting from index 1 of itemsToDeleteList to the index same as the value of bulkSize
    	List<ItemEntity> itemsToDeleteList = items.subList(0, bulkSize);
    	log.info("Deleting {} items with name: {}", itemsToDeleteList.size(), itemsToDelete.getItemName());
    	itemrepo.deleteAll(itemsToDeleteList);
    	log.info("Successfully deleted {} items", itemsToDeleteList.size());
    	return ResponseEntity
    			.status(HttpStatus.OK) // 200
    			.body("Successfully deleted " + itemsToDeleteList.size() + " items.");
    }

    public List<ItemEntity> getAllItems(){
        return itemrepo.findAll();
    }

    @Transactional
    public ResponseEntity<?> returnItem(List<Map<String, Object>> itemsRequest){
        List<ItemEntity> itemsToUpdate = new ArrayList<>();
        
        for (Map<String, Object> itemReq : itemsRequest) {
        	String itemName = (String) itemReq.get("itemName");
            int borrowCartID = (int) itemReq.get("borrowCartID");
            String status = (String) itemReq.get("status");
            int quantity = (int) itemReq.get("quantity");
            
            List<ItemEntity> items = itemrepo.findByItemNameAndBorrowCart_Id(itemName, borrowCartID);
            
            if (items.isEmpty()) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Items with name " + itemName + "or with id " +borrowCartID + " could not be found.");
            }else if(quantity > items.size()) {
            	return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("quantity is greater than the number of items the user borrowed");
            }
            
            List<ItemEntity> itemsToReturn = items.subList(0, quantity);
            
            // Implement in the future: for items with specific status, users should allow which item was damage/missing through unique id
                
            itemsToReturn.forEach(item -> {
                item.setStatus(status);
                item.setUser(null);
                itemsToUpdate.add(item);
            });
        }
        
        itemrepo.saveAll(itemsToUpdate);
        
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(itemsToUpdate);
    }


}
