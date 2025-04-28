package edu.cit.lemslite.Controller;

import edu.cit.lemslite.Entity.YearSectionEntity;
import edu.cit.lemslite.Service.YearSectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/yearsection")
@CrossOrigin(origins = "https://cit-lems.vercel.app")
public class YearSectionController {
    @Autowired
    YearSectionService yrsecserv;

    @GetMapping
    public ResponseEntity<?> getAllYearSections() {
        return yrsecserv.getAllYearSections();
    }

    @GetMapping("/{yearId}")
    public ResponseEntity<?> getYearSectionById(@PathVariable int yearId) {
        return yrsecserv.getYearSectionById(yearId);
    }

    @GetMapping("/search")
    public ResponseEntity<?> getYearSectionsByYearAndSection(
            @RequestParam String year,
            @RequestParam String section) {
        return yrsecserv.getYearSectionsByYearAndSection(year, section);
    }

    @PostMapping
    public ResponseEntity<?> createYearSection(@RequestBody YearSectionEntity yearSection) {
        return yrsecserv.createYearSection(yearSection);
    }

    @PutMapping("/{yearId}")
    public ResponseEntity<?> updateYearSection(
            @PathVariable int yearId,
            @RequestBody YearSectionEntity yearSection) {
        return yrsecserv.updateYearSection(yearId, yearSection);
    }

    @DeleteMapping("/{yearId}")
    public ResponseEntity<?> deleteYearSection(@PathVariable int yearId) {
        return yrsecserv.deleteYearSection(yearId);
    }
}
