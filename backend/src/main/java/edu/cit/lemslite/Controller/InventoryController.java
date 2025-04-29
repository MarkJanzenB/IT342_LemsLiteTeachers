package edu.cit.lemslite.Controller;

import edu.cit.lemslite.Entity.InventoryEntity;
import edu.cit.lemslite.Entity.ItemEntity;
import edu.cit.lemslite.Repository.ItemRepository;
import edu.cit.lemslite.Service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/inventory")
@CrossOrigin(origins = "https://lems-lite.vercel.app/")

public class InventoryController {
    @Autowired
    InventoryService inventoryService;

    @Autowired
    private ItemRepository itemRepository;

    @GetMapping("/message")
    public String testMessage() {
        return "inventoryService is working";
    }
    @GetMapping("/getAllInventory")
    public List<InventoryEntity> getAllInventory() {
        return inventoryService.getAllInventory();
    }
    
    @PostMapping("/addinventory")
    public ResponseEntity<?> addInventory(@RequestBody List<InventoryEntity> inventoryArray) {
    	return inventoryService.addInventory(inventoryArray);
    }
    
    @GetMapping("/getinventorybycategory")
    public List<InventoryEntity> getInventoryByCategory(@RequestParam int categoryId){
    	return inventoryService.getInventoryByCategory(categoryId);
    }
    
    @GetMapping("/isinventoryexists")
    public ResponseEntity<?> isInventoryExists(@RequestParam String inventoryName){
    	return inventoryService.isInventoryExists(inventoryName);
    }
    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteInventory(@PathVariable int id){
    	return inventoryService.deleteInventory(id);
    }
    
    @PutMapping("/updateinventory")
    public ResponseEntity<?> updateInventory(@RequestParam int id, @RequestBody InventoryEntity inventory){
    	return inventoryService.updateInventory(id, inventory);
    }

    // Add this new endpoint
    @GetMapping("/items")
    public ResponseEntity<List<InventoryEntity>> getAllInventoryItems() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }


    @GetMapping("/item/{itemName}")
    public ResponseEntity<InventoryEntity> getInventoryItemByName(@PathVariable String itemName) {
        InventoryEntity inventoryItem = inventoryService.getInventoryByName(itemName);
        if (inventoryItem == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(inventoryItem);
    }


    @GetMapping("/item/{itemId}/variants")
    public ResponseEntity<List<String>> getItemVariants(@PathVariable Integer itemId) {
        return itemRepository.findById(itemId)
                .map(item -> {
                    // Fetch variants for the specific item ID
                    List<String> variants = itemRepository.findByItemId(item.getItemId())
                            .stream()
                            .map(ItemEntity::getVariant)
                            .filter(variant -> variant != null && !variant.isEmpty())
                            .distinct()
                            .collect(Collectors.toList());
                    return ResponseEntity.ok(variants);
                })
                .orElse(ResponseEntity.notFound().build());
    }




}