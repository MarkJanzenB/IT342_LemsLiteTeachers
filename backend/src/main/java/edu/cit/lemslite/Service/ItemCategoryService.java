package edu.cit.lemslite.Service;

import edu.cit.lemslite.Entity.ItemCategoryEntity;
import edu.cit.lemslite.Repository.ItemCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
