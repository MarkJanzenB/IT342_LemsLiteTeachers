package edu.cit.lemslite.Controller;

import edu.cit.lemslite.Entity.ItemCategoryEntity;
import edu.cit.lemslite.Service.ItemCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/itemcategory")
@CrossOrigin(origins = "https://lems-lite.vercel.app")

public class ItemCategoryController {
    @Autowired
    ItemCategoryService itemCatServ;

    @GetMapping("/message")
    public String testMessage() {
        return "ItemCategoryController is working";
    }

    @PostMapping("/insertitemcategory")
    public ItemCategoryEntity addItemCategory(@RequestBody ItemCategoryEntity itemCategory) {
        return itemCatServ.addItemCategory(itemCategory);
    }

    @GetMapping("/getallitemcategories")
    public List<ItemCategoryEntity> getAllItemCategories() {
        return itemCatServ.getAllItemCategories();
    }

}
