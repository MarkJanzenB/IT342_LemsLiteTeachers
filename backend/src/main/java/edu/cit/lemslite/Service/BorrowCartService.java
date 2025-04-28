// File: src/main/java/com/capstone/LEMS/Service/BorrowCartService.java
package edu.cit.lemslite.Service;

import edu.cit.lemslite.Entity.*;
import edu.cit.lemslite.Repository.*;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class BorrowCartService {

    @Autowired
    private BorrowCartRepository borrowCartRepository;

    @Autowired
    private PreparingItemRepository preparingItemRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private TeacherScheduleRepository teacherScheduleRepository; // Autowire TeacherScheduleRepository

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    UserRepository userrepo;


    private static final Logger log = LoggerFactory.getLogger(BorrowCartService.class);

    public List<BorrowCartEntity> getAllBorrowCarts() {
        return borrowCartRepository.findAll();
    }

    public BorrowCartEntity addToBorrowCart(String instiId, String itemName, String categoryName, int quantity) {
        // Find existing borrow cart based on itemName and instiId
        BorrowCartEntity existingBorrowCart = borrowCartRepository.findByItemNameAndInstiId(itemName, instiId);

        if (existingBorrowCart != null) {
            log.info("Existing borrow cart: {} ", existingBorrowCart.getInstiId());
            // If item already exists in the borrow cart, just update the quantity
            existingBorrowCart.setQuantity(existingBorrowCart.getQuantity() + quantity);
            return borrowCartRepository.save(existingBorrowCart);
        }

        // Otherwise, create a new borrow cart entity with item details and save
        BorrowCartEntity borrowCart = new BorrowCartEntity(instiId, itemName, categoryName, quantity);
        return borrowCartRepository.save(borrowCart);
    }

    public List<BorrowCartEntity> getBorrowCartsByInsti(String instiId) {
        return borrowCartRepository.findByInstiId(instiId);
    }

    @Transactional
    public void clearCart(String instiId) {
        log.info("Clearing borrow cart for instiId: " + instiId);
        borrowCartRepository.deleteByInstiId(instiId);
    }

    public void deleteBorrowCart(int id) {
        BorrowCartEntity borrowCart = borrowCartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Borrow cart item not found"));

        // Remove item from the borrow cart WITHOUT modifying inventory
        log.info("Removing item from borrow cart: " + borrowCart.getItemName());
        borrowCartRepository.delete(borrowCart);
    }

    //    @Transactional
//    public void moveToPreparingItem(String instiId) {
//        moveToPreparingItem(instiId, null); // Overloaded method to handle cases where no schedule is selected initially
//    }


    @Transactional
    public void moveToPreparingItem(String instiId, Integer teacherScheduleId) { // Receive teacherScheduleId

        List<BorrowCartEntity> carts = borrowCartRepository.findByInstiId(instiId);
        if (carts.isEmpty()) {
            throw new IllegalStateException("No items to move for instiId: " + instiId);
        }

        TeacherScheduleEntity teacherSchedule = null;
        if (teacherScheduleId != null) {
            teacherSchedule = teacherScheduleRepository.findById(teacherScheduleId)
                    .orElseThrow(() -> new RuntimeException("Teacher schedule not found with ID: " + teacherScheduleId));
        }

        String referenceId = "PI-" + instiId + "-" + ThreadLocalRandom.current().nextInt(1000, 10000);

        for (BorrowCartEntity cartItem : carts) {
            UserEntity user = userrepo.findByInstiId(instiId);
            PreparingItemEntity preparingItem = new PreparingItemEntity();

            preparingItem.setInstiId(instiId);
            preparingItem.setItemName(cartItem.getItemName());
            preparingItem.setCategoryName(cartItem.getCategoryName());
            preparingItem.setQuantity(cartItem.getQuantity());
            preparingItem.setStatus("Preparing");
            preparingItem.setUser(user);
            preparingItem.setDateCreated(LocalDate.now());
            preparingItem.setTeacherSchedule(teacherSchedule); // Set the teacher schedule

            InventoryEntity inventoryItem = inventoryRepository.findByNameIgnoreCase(cartItem.getItemName());
            if (inventoryItem == null) {
                throw new RuntimeException("Item not found in inventory: " + cartItem.getItemName());
            }

            if (inventoryItem.getQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Not enough stock available in inventory for item: " + cartItem.getItemName() + ". Requested: " + cartItem.getQuantity() + ", Available: " + inventoryItem.getQuantity());
            }

            int reducedQuantity = inventoryItem.getQuantity() - cartItem.getQuantity();
            inventoryItem.setQuantity(reducedQuantity);
            if(reducedQuantity == 0) {
                inventoryItem.setStatus("Out of stock");
            }

            inventoryRepository.save(inventoryItem);
            preparingItem.setReferenceCode(referenceId);
            preparingItemRepository.save(preparingItem);
        }

        borrowCartRepository.deleteByInstiId(instiId);
    }


    public List<TeacherScheduleEntity> getTeacherScheduleByInstiId(String instiId) {
        UserEntity teacher = userrepo.findByInstiId(instiId);
        if (teacher == null) {
            throw new RuntimeException("User not found with instiId: " + instiId);
        }
        return teacherScheduleRepository.findByTeacher(teacher);
    }

    public void updateItemQuantity(int id, int newQuantity) {
        Optional<BorrowCartEntity> borrowCartEntityOptional = borrowCartRepository.findById(id);
        if (borrowCartEntityOptional.isPresent()) {
            BorrowCartEntity borrowCartEntity = borrowCartEntityOptional.get();
            borrowCartEntity.setQuantity(newQuantity);
            borrowCartRepository.save(borrowCartEntity);
        } else {
            throw new RuntimeException("Borrow cart item not found with ID: " + id);
        }
    }

    public List<String> getAvailableVariants(String itemName) {
        // Fetch a single ItemEntity by itemName
        ItemEntity item = itemRepository.findByItemNameIgnoreCase(itemName);

        // Check if item is found and has variants
        if (item != null && item.getVariant() != null) {
            // Split the variant string into a list if variants are available
            return Arrays.asList(item.getVariant().split(","));
        }

        // If no item is found or no variant exists, return an empty list
        return Collections.emptyList();
    }



}