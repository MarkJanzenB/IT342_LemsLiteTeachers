package edu.cit.lemslite.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.lemslite.Entity.ItemEntity;
import edu.cit.lemslite.Service.ItemService;

@RestController
@RequestMapping("/item")
@CrossOrigin
public class ItemController {
    @Autowired
    ItemService itemserv;

    @GetMapping("/message")
    public String testMessage() {
        return "ItemController is working";
    }

    @PostMapping("/insertitem")
    public ResponseEntity<?> addItem(@RequestBody ItemEntity item, @RequestParam int bulkSize) {
        return itemserv.AddItem(item, bulkSize);
    }
    
    @PutMapping("/updateitems")
    public ResponseEntity<?> updateItems(@RequestParam String itemToEdit, @RequestBody ItemEntity newItemDetails){
    	return itemserv.updateItems(itemToEdit, newItemDetails);
    }
    
    @DeleteMapping("/deleteitems")
    public ResponseEntity<?> deleteItems(@RequestParam int bulkSize, @RequestBody ItemEntity itemsToDelete){
    	return itemserv.deleteItems(bulkSize, itemsToDelete);
    }

    @GetMapping("/getallitems")
    public List<ItemEntity> getAllItems(){
        return itemserv.getAllItems();
    }

    
    @PutMapping("/return")
    public ResponseEntity<?> returnItem(@RequestBody List<Map<String, Object>> itemsRequest) {
        return itemserv.returnItem(itemsRequest);
    }
    

}
