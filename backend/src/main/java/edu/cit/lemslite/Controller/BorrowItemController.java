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


@RestController
@RequestMapping("/api/borrowitem")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend access
public class BorrowItemController {

    @Autowired
    private BorrowItemService borrowItemService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TeacherScheduleRepository tsrepo;

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
            @RequestParam String borrowedId, // ✅ Accept the borrowedId from frontend
            @RequestParam Long itemId,
            @RequestParam String itemName,
            @RequestParam String categoryName,
            @RequestParam Integer quantity,
            @RequestParam String status,
            @RequestParam(required = false) Integer teacherScheduleId) {

        try {
            UserEntity user = userRepository.findByInstiId(uid);
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found.");
            }

            BorrowItemEntity borrowItemEntity = new BorrowItemEntity();
            borrowItemEntity.setUser(user); // ✅ Set the user
            borrowItemEntity.setBorrowedId(borrowedId);  // ✅ Set the same Borrowed ID
            borrowItemEntity.setItemId(itemId);
            borrowItemEntity.setItemName(itemName);
            borrowItemEntity.setCategoryName(categoryName);
            borrowItemEntity.setQuantity(quantity);
            borrowItemEntity.setStatus(status);
            borrowItemEntity.setBorrowedDate(new Date());
            if(teacherScheduleId != null) {
            	TeacherScheduleEntity teacherSchedule = tsrepo.findById(teacherScheduleId).orElse(null);
            	if (teacherSchedule == null) {
                	return ResponseEntity.badRequest().body("teacher schedule with ID: " + teacherScheduleId + " could not be found");
                }
//            	borrowItemEntity.setTeacherSchedule(teacherSchedule);
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


}



