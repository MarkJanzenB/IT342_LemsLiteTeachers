package edu.cit.lemslite.Service;

import edu.cit.lemslite.Entity.ItemEntity;
import edu.cit.lemslite.Entity.PreparingItemEntity;
import edu.cit.lemslite.Repository.ItemRepository;
import edu.cit.lemslite.Repository.PreparingItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PreparingItemService {

    @Autowired
    private PreparingItemRepository preparingItemRepository;

    @Autowired
    private ItemRepository itemRepository;

    // Finalize preparing item (Validate unique_id and assign)
    public void finalizePreparingItem(int id, String uniqueId) {
        // Fetch the PreparingItem by its ID
        Optional<PreparingItemEntity> optionalItem = preparingItemRepository.findById(id);
        if (optionalItem.isPresent()) {
            PreparingItemEntity preparingItem = optionalItem.get();

            // Fetch the associated ItemEntity (use the item_id that was saved in the PreparingItemEntity)
            ItemEntity item = preparingItem.getItem();

            if (item != null) {
                // You can now use the `item` to access its `uniqueId`
                String itemUniqueId = item.getUniqueId();

                // Set the uniqueId for PreparingItemEntity based on ItemEntity's uniqueId
                preparingItem.setUniqueId(itemUniqueId);

                // Update other fields as needed
                preparingItem.setStatus("finalized");  // Change status to finalized
                preparingItem.setReferenceCode("PI-" + item.getItemName().charAt(0) + itemUniqueId); // Generate Reference Code

                // Save the updated PreparingItem
                preparingItemRepository.save(preparingItem);
            } else {
                throw new RuntimeException("Item not found.");
            }
        } else {
            throw new RuntimeException("Preparing item not found.");
        }
    }


    // Checkout preparing item and mark it as Borrowed
    public void checkoutPreparingItem(int id) {
        Optional<PreparingItemEntity> optionalItem = preparingItemRepository.findById(id);
        if (optionalItem.isPresent()) {
            PreparingItemEntity preparingItem = optionalItem.get();

            // Ensure the item is finalized before checking out
            if ("finalized".equals(preparingItem.getStatus())) {
                preparingItem.setStatus("Borrowed");  // Change status to Borrowed
                preparingItemRepository.save(preparingItem);  // Save the updated PreparingItem
            } else {
                throw new RuntimeException("Item is not finalized yet.");
            }
        } else {
            throw new RuntimeException("Preparing item not found.");
        }
    }

    // Fetch all preparing items by institution ID
    public List<PreparingItemEntity> getPreparingItemsByInstiId(String instiId) {
        return preparingItemRepository.findAllByInstiId(instiId);
    }

    // Create a new preparing item
    public PreparingItemEntity createPreparingItem(PreparingItemEntity preparingItemEntity) {
        return preparingItemRepository.save(preparingItemEntity);
    }

    // Delete preparing item
    public void deletePreparingItem(int id) {
        preparingItemRepository.deleteById(id);
    }
}
