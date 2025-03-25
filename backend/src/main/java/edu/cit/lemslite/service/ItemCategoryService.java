package edu.cit.lemslite.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.cit.lemslite.entity.ItemCategoryEntity;
import edu.cit.lemslite.repository.ItemCategoryRepository;

@Service
public class ItemCategoryService {
    @Autowired
    ItemCategoryRepository itemCatRepo;

    public ItemCategoryEntity addItemCategory(ItemCategoryEntity itemCategory) {
        return itemCatRepo.save(itemCategory);
    }

    public List<ItemCategoryEntity> getAllItemCategories() {
        return itemCatRepo.findAll();
    }
}
