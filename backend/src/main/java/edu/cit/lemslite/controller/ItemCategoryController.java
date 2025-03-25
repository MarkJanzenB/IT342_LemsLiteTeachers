package edu.cit.lemslite.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.lemslite.entity.ItemCategoryEntity;
import edu.cit.lemslite.service.ItemCategoryService;

@RestController
@RequestMapping("/itemcategory")
@CrossOrigin

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
