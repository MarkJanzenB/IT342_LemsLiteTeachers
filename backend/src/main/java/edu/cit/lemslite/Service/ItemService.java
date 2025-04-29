package edu.cit.lemslite.Service;

import edu.cit.lemslite.Entity.*;
import edu.cit.lemslite.Repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ItemService {
	private static final Logger log = LoggerFactory.getLogger(ItemService.class);
	@Autowired
	ItemRepository itemrepo;

	@Autowired
	IdCounterService idcountserv;

	@Autowired
	UserRepository userrepo;

	@Autowired
	InventoryRepository invrepo;

	@Autowired
	BorrowCartRepository borrowcartrepo;

	@Autowired
	BorrowItemRepository borrowitemrepo;

	@Autowired
	ManufacturerRepository mrepo;

	@Autowired
	BatchResupplyRepository brrepo;

	@Autowired
	BatchResupplyService brserv;

	@SuppressWarnings({ "unchecked", "null" })
	@Transactional
	public ResponseEntity<?> AddItem(Map<String, Object> itemsToAdd, int bulkSize) {
		String itemName = (String) itemsToAdd.get("item_name");
		int inventoryId = (int) itemsToAdd.get("inventory_id");
		String category = (String) itemsToAdd.get("category");
		List<String> uniqueIds = (List<String>) itemsToAdd.get("unique_ids");
		List<ItemEntity> itemsToSave = new ArrayList<>();
		int quantity = (int) itemsToAdd.get("quantity");
		String expiryDateStr = (String) itemsToAdd.get("expiry_date");
		LocalDate expiryDate = (expiryDateStr != null  && !expiryDateStr.isEmpty()) ? LocalDate.parse(expiryDateStr) : null;
		String variant = (String) itemsToAdd.get("variant");
		Integer manufacturerId = (Integer) itemsToAdd.get("manufacturer_id");
		ManufacturerEntity manufacturer = null;
		UserEntity user = userrepo.findById((int) itemsToAdd.get("uid")).orElse(null);

		BatchResupplyEntity batchResupply = new BatchResupplyEntity();

		batchResupply.setDateResupply(LocalDate.now());
		batchResupply.setAddedBy(user);

		batchResupply = brserv.addBatchResupply(batchResupply);


		if(manufacturerId != null) {
			manufacturer = mrepo.findById(manufacturerId).orElse(null);
		}

		if(variant == null) {
			return ResponseEntity
					.status(HttpStatus.BAD_REQUEST)
					.body("Variant field should not be blank");
		}

		if(bulkSize <= 0) {
			return ResponseEntity
					.status(HttpStatus.BAD_REQUEST) // 400
					.body("Invalid bulk size. It must be greater than zero");
		}

		InventoryEntity inventory = invrepo.findById(inventoryId).orElse(null);
		if(inventory == null) {
			return ResponseEntity
					.status(HttpStatus.BAD_REQUEST) // 400hy7h
					.body("Inventory ID: " + inventoryId + " does not exists");
		}

		if(category != null && category.equalsIgnoreCase("Consumables")) {
			ItemEntity newItem = new ItemEntity();
			newItem.setItemName(itemName);
			newItem.setInventory(inventory);
			newItem.setStatus("Available");
			newItem.setAutoUid(false);
			newItem.setQuantity(quantity);
			newItem.setExpiryDate(expiryDate);
			newItem.setVariant(variant);
			newItem.setBatchResupply(batchResupply);
			if(manufacturer != null) {
				newItem.setManufacturer(manufacturer);
			}
			itemsToSave.add(newItem);
			//add supply batch id soon
		}else {

			List<ItemEntity> foundItems = itemrepo.findByUniqueIdIn(uniqueIds);
			if(!foundItems.isEmpty()) {
				List<String> foundUniqueIds = foundItems.stream()
						.map(ItemEntity::getUniqueId)
						.collect(Collectors.toList());

				Map<String, Object> response = new HashMap<>();
				response.put("message", "The following Unique IDs already exist");
				response.put("unique_ids", foundUniqueIds);
				return ResponseEntity
						.status(HttpStatus.CONFLICT)
						.body(response);
			}

			for(int i = 1; i <= bulkSize; i++) {
				ItemEntity newItem = new ItemEntity();
				newItem.setItemName(itemName);
				newItem.setInventory(inventory);
				newItem.setStatus("Available");
				newItem.setVariant(variant);
				newItem.setQuantity(1);
				newItem.setBatchResupply(batchResupply);
				if(manufacturer != null) {
					newItem.setManufacturer(manufacturer);
				}
				if(i <= uniqueIds.size()) {
					newItem.setUniqueId(uniqueIds.get(i - 1));
				}else {
					String prefix = itemName.substring(0, 2).toUpperCase()
							+ itemName.substring(itemName.length() - 1).toUpperCase();
					int nextNumber = idcountserv.getNextId() + i;
					String uniqueId = prefix + String.format("%04d", nextNumber);
					newItem.setUniqueId(uniqueId);
					newItem.setAutoUid(true);
				}

				itemsToSave.add(newItem);
			}
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
//      if(items.isEmpty()) {
//         log.warn("No items found with name: {}", itemToEdit);
//         return ResponseEntity
//               .status(HttpStatus.NOT_FOUND) // 404
//               .body("No items found with name: " + itemToEdit);
//      }


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

	@SuppressWarnings("unchecked")
	@Transactional
	public ResponseEntity<?> borrowItem(Map<String, Object> request){
		int userID = (int) request.get("userID");
		List<Map<String,Object>> itemsRequest = (List<Map<String,Object>>) request.get("items");
		List<ItemEntity> itemsToBorrow = new ArrayList<>();
		UserEntity user = userrepo.findById(userID).orElse(null);
		int borrowCartID = (int) request.get("borrowCartID");
		BorrowCartEntity borrowCart = borrowcartrepo.findById(borrowCartID).orElse(null);

		// Prevents borrowing of item if user is not found
		if(user == null) {
			return ResponseEntity
					.status(HttpStatus.NOT_FOUND)
					.body("User with ID " + userID + " could not be found");
		}

		// Borrowing of items
		for(Map<String, Object> itemReq: itemsRequest) {
			String itemName = (String) itemReq.get("itemName");
			int quantity = (int) itemReq.get("quantity");
			List<ItemEntity> availableItems = itemrepo.findByItemNameAndStatus(itemName, "Available");

			// Prevents borrowing if there is not enough available items
			if (availableItems.size() < quantity) {
				return ResponseEntity
						.status(HttpStatus.BAD_REQUEST)
						.body("Not enough available items for: " + itemName);
			}

			List<ItemEntity> itemsToAssign = availableItems.subList(0, quantity);
			itemsToAssign.forEach(item -> {
				item.setUser(user);
				item.setStatus("Preparing");
				item.setBorrowCart(borrowCart);
			});
			itemsToBorrow.addAll(itemsToAssign);
		}
		itemrepo.saveAll(itemsToBorrow);
		return ResponseEntity
				.status(HttpStatus.OK)
				.body(itemsToBorrow);
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
				item.setBorrowCart(null);
				itemsToUpdate.add(item);
			});
		}

		itemrepo.saveAll(itemsToUpdate);

		return ResponseEntity
				.status(HttpStatus.OK)
				.body(itemsToUpdate);
	}

	public ResponseEntity<?> getResupplyHistory(LocalDate resupplyDate, int uid){
		UserEntity user = userrepo.findById(uid).orElse(null);
		List<BatchResupplyEntity> batches = brrepo.findByDateResupplyAndAddedBy(resupplyDate, user);
		List<ItemEntity> itemToSend = new ArrayList<>();

		for(int i = 0; i < batches.size(); i++) {
			List<ItemEntity> items = itemrepo.findByBatchResupply(batches.get(i));
			itemToSend.addAll(items);
		}

		Map<String, List<ItemEntity>> groupedItems = itemToSend.stream()
				.collect(Collectors.groupingBy(ItemEntity::getItemName));

		List<Map<String, Object>> response = new ArrayList<>();
		int index = 1;
		for(Map.Entry<String, List<ItemEntity>> entry : groupedItems.entrySet()) {
			String itemName = entry.getKey();
			List<ItemEntity> itemList = entry.getValue();

			Map<String, Object> itemSummary = new HashMap<>();
			itemSummary.put("id", index++);
			itemSummary.put("name", itemName);
			itemSummary.put("quantity", itemList.size());

			List<Map<String, Object>> variants = itemList.stream().map(item -> {
				Map<String, Object> variant = new HashMap<>();
				variant.put("id", item.getItemId());
				variant.put("name", item.getItemName());
				variant.put("serialNumber", item.getUniqueId());
				return variant;
			}).collect(Collectors.toList());

			itemSummary.put("variants", variants);
			response.add(itemSummary);
		}

		return ResponseEntity
				.status(HttpStatus.OK)
				.body(response);
	}

	public ResponseEntity<?> getListOfUniqueIDs(String itemName, String category){
		/*
		 * Get the items by their item name
		 * Only get the items that are available
		 * */
		List<ItemEntity> items = itemrepo.findByItemName(itemName);
		List<ItemEntity> availableItems = items.stream()
				.filter(item -> "Available".equals(item.getStatus()))
				.collect(Collectors.toList());
		/*
		 * For consumables only return the whole entity
		 * */
		if(category != null && !category.isBlank() && !category.isEmpty() && category.equalsIgnoreCase("Consumables")) {
			return ResponseEntity
					.status(HttpStatus.OK)
					.body(availableItems);
		}else {
			/*
			 * Only Extract the unique IDs to a List if the unique ID
			 * is not auto generated
			 * */
			List<String> uniqueIds = availableItems.stream()
					.filter(item -> !item.isAutoUid())
					.map(ItemEntity::getUniqueId)
					.collect(Collectors.toList());
			return ResponseEntity
					.status(HttpStatus.OK)
					.body(uniqueIds);

		}
	}

	public ResponseEntity<?> findByPreparingItemIds(List<Integer> preparingItemIds){
		return ResponseEntity
				.status(HttpStatus.OK)
				.body(itemrepo.findByPreparingItem_IdIn(preparingItemIds));
	}

	public List<String> getAvailableVariants(String itemName) {
		return itemrepo.findVariantsByItemName(itemName);
	}

}

