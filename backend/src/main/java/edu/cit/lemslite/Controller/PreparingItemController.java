package edu.cit.lemslite.Controller;

import edu.cit.lemslite.DTO.CheckoutRequestDTO;
import edu.cit.lemslite.Entity.PreparingItemEntity;
import edu.cit.lemslite.Service.PreparingItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/preparing-items")
@CrossOrigin(origins = "https://lems-lite.vercel.app")
public class PreparingItemController {

    @Autowired
    private PreparingItemService preparingItemService;

    /*
     *REFACTOR: params is too long and looks unclean, use DTO instead.
     * */
    @PostMapping("/addToPreparingItem")
    public PreparingItemEntity addToPreparingItem(
            @RequestParam String uid,
            @RequestParam String itemName,
            @RequestParam String categoryName,
            @RequestParam int quantity,
            @RequestParam String status
    ) {
        return preparingItemService.addToPreparingItem(uid, itemName, categoryName, quantity, status);
    }

    /*
     * REFACTOR: change naming convention for the url
     * currently its misleading
     * */
    // Fetch preparing items by institution UID
    @GetMapping("/getpreparingitems")
    public List<PreparingItemEntity> getPreparingItems(@RequestParam(required = false) String instiId, @RequestParam String status) {
        return preparingItemService.getPreparingItems(instiId, status);
    }

    @PutMapping("/proceedtocheckout")
    public void proceedToCheckOut(@RequestBody CheckoutRequestDTO checkoutRequest) {
    	preparingItemService.proceedToCheckOut(checkoutRequest.getItemQuantities(), checkoutRequest.getUniqueIdsMap());
    }

    @GetMapping("/teacherSchedule/{preparingItemId}")
    public ResponseEntity<Map<String, Object>> getTeacherScheduleByPreparingItemId(@PathVariable int preparingItemId) {
        try {
            Map<String, Object> schedule = preparingItemService.getTeacherScheduleByPreparingItemId(preparingItemId);
            if (schedule != null) {
                return new ResponseEntity<>(schedule, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Or another appropriate status
            }
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
