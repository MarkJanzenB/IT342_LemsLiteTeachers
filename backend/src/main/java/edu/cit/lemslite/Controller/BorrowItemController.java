package edu.cit.lemslite.Controller;

import edu.cit.lemslite.Entity.BorrowItemEntity;
import edu.cit.lemslite.Entity.TeacherScheduleEntity;
import edu.cit.lemslite.Entity.UserEntity;
import edu.cit.lemslite.Repository.TeacherScheduleRepository;
import edu.cit.lemslite.Repository.UserRepository;
import edu.cit.lemslite.Service.BorrowItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/borrowitem")
@CrossOrigin(origins = "https://lems-lite.vercel.app/")
public class BorrowItemController {

    @Autowired
    private BorrowItemService borrowItemService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TeacherScheduleRepository teacherScheduleRepository;

    @GetMapping("/all")
    public List<BorrowItemEntity> getAllBorrowItems() {
        return borrowItemService.getAllItems();
    }

    @GetMapping("/uid/{uid}")
    public ResponseEntity<List<BorrowItemEntity>> getBorrowItemsByUid(@PathVariable int uid) {
        return ResponseEntity.ok(borrowItemService.getBorrowItemsByUid(uid));
    }


    @PostMapping("/addBorrowItems")
    public ResponseEntity<?> addBorrowItems(
            @RequestParam String uid,
            @RequestParam String borrowedId,
            @RequestParam Integer itemId,
            @RequestParam String itemName,
            @RequestParam String categoryName,
            @RequestParam Integer quantity,
            @RequestParam String status,
            @RequestParam(required = false) Integer teacherScheduleId) { // Changed to Integer

        try {
            UserEntity user = userRepository.findByInstiId(uid);
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found.");
            }

            BorrowItemEntity borrowItemEntity = new BorrowItemEntity();
            borrowItemEntity.setUser(user);
            borrowItemEntity.setBorrowedId(borrowedId);
            borrowItemEntity.setItemId(itemId);
            borrowItemEntity.setItemName(itemName);
            borrowItemEntity.setCategoryName(categoryName);
            borrowItemEntity.setQuantity(quantity);
            borrowItemEntity.setStatus(status);
            borrowItemEntity.setBorrowedDate(new Date());

            if (teacherScheduleId != null) {
                Optional<TeacherScheduleEntity> teacherScheduleOptional = teacherScheduleRepository.findById(teacherScheduleId);
                if (teacherScheduleOptional.isPresent()) {
                    borrowItemEntity.setTeacherSchedule(teacherScheduleOptional.get());
                } else {
                    return ResponseEntity.badRequest().body("Teacher schedule with ID: " + teacherScheduleId + " could not be found");
                }
            }

            return borrowItemService.addBorrowItem(borrowItemEntity);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/updateStatus/{borrowedId}")
    public ResponseEntity<String> updateStatusByBorrowedId(@PathVariable String borrowedId, @RequestParam String status) {
        try {
            borrowItemService.updateStatusByBorrowedId(borrowedId, status);
            return ResponseEntity.ok("Status updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/teacherSchedule/{preparingItemId}")  // Corrected the path variable name to preparingItemId
    public ResponseEntity<?> getTeacherScheduleByPreparingItemId(@PathVariable Long preparingItemId) {
        try {
            BorrowItemEntity borrowItem = borrowItemService.getBorrowItemById(preparingItemId); // Added this method to the service
            if (borrowItem == null) {
                return ResponseEntity.notFound().build(); // Return 404 if the item is not found
            }
            TeacherScheduleEntity schedule = borrowItem.getTeacherSchedule();
            if (schedule != null) {
                return ResponseEntity.ok(schedule);
            } else {
                return ResponseEntity.ok(null); // Return 200 with null body, indicating no schedule
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}
