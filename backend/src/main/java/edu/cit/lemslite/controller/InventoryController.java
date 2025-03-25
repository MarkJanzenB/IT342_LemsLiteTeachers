package com.capstone.LEMS.Controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.capstone.LEMS.Entity.InventoryEntity;
import com.capstone.LEMS.Service.InventoryService;
@RestController
@RequestMapping("/inventory")
@CrossOrigin

public class InventoryController {
    @Autowired
    InventoryService inventoryService;
    @GetMapping("/message")
    public String testMessage() {
        return "inventoryService is working";
    }
    @GetMapping("/getAllInventory")
    public List<InventoryEntity> getAllInventory() {
        return inventoryService.getAllInventory();
    }
    
    @PostMapping("/addinventory")
    public ResponseEntity<?> addInventory(@RequestBody InventoryEntity inventory) {
    	return inventoryService.addInventory(inventory);
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
    
}