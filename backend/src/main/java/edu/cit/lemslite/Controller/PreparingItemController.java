package edu.cit.lemslite.Controller;

import edu.cit.lemslite.Service.PreparingItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/preparing-items")
public class PreparingItemController {

    @Autowired
    private PreparingItemService preparingItemService;

    // Finalize preparing item and validate unique_id
    @PutMapping("/finalize/{id}")
    public void finalizePreparingItem(@PathVariable int id, @RequestParam String uniqueId) {
        preparingItemService.finalizePreparingItem(id, uniqueId);
    }

    // Checkout preparing item and mark it as Borrowed
    @PutMapping("/checkout/{id}")
    public void checkoutPreparingItem(@PathVariable int id) {
        preparingItemService.checkoutPreparingItem(id);
    }
}
