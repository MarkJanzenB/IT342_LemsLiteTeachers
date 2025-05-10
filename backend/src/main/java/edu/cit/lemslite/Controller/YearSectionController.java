package edu.cit.lemslite.Controller;

import edu.cit.lemslite.Entity.YearSectionEntity;
import edu.cit.lemslite.Service.YearSectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/yearsection")
public class YearSectionController {
    
    @Autowired
    private YearSectionService yearSectionService;
    
    // Get all year sections
    @GetMapping("/getall")
    public ResponseEntity<List<YearSectionEntity>> getAllYearSections() {
        List<YearSectionEntity> yearSections = yearSectionService.getAllYearSections();
        return new ResponseEntity<>(yearSections, HttpStatus.OK);
    }
    
    // Get year section by ID
    @GetMapping("/get/{id}")
    public ResponseEntity<YearSectionEntity> getYearSectionById(@PathVariable("id") int id) {
        Optional<YearSectionEntity> yearSectionData = yearSectionService.getYearSectionById(id);
        
        if (yearSectionData.isPresent()) {
            return new ResponseEntity<>(yearSectionData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Create new year section
    @PostMapping("/create")
    public ResponseEntity<YearSectionEntity> createYearSection(@RequestBody YearSectionEntity yearSection) {
        try {
            YearSectionEntity _yearSection = yearSectionService.saveYearSection(yearSection);
            return new ResponseEntity<>(_yearSection, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Update year section
    @PutMapping("/update/{id}")
    public ResponseEntity<YearSectionEntity> updateYearSection(@PathVariable("id") int id, @RequestBody YearSectionEntity yearSection) {
        Optional<YearSectionEntity> yearSectionData = yearSectionService.getYearSectionById(id);
        
        if (yearSectionData.isPresent()) {
            YearSectionEntity _yearSection = yearSectionData.get();
            _yearSection.setYear(yearSection.getYear());
            _yearSection.setSection(yearSection.getSection());
            // yearsect will be updated automatically in the service layer
            
            return new ResponseEntity<>(yearSectionService.updateYearSection(_yearSection), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Delete year section
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<HttpStatus> deleteYearSection(@PathVariable("id") int id) {
        try {
            yearSectionService.deleteYearSection(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Find by year
    @GetMapping("/byyear/{year}")
    public ResponseEntity<List<YearSectionEntity>> findByYear(@PathVariable("year") int year) {
        List<YearSectionEntity> yearSections = yearSectionService.findByYear(year);
        return new ResponseEntity<>(yearSections, HttpStatus.OK);
    }
    
    // Find by section
    @GetMapping("/bysection/{section}")
    public ResponseEntity<List<YearSectionEntity>> findBySection(@PathVariable("section") String section) {
        List<YearSectionEntity> yearSections = yearSectionService.findBySection(section);
        return new ResponseEntity<>(yearSections, HttpStatus.OK);
    }
    
    // Find by yearsect
    @GetMapping("/byyearsect/{yearsect}")
    public ResponseEntity<YearSectionEntity> findByYearsect(@PathVariable("yearsect") String yearsect) {
        YearSectionEntity yearSection = yearSectionService.findByYearsect(yearsect);
        
        if (yearSection != null) {
            return new ResponseEntity<>(yearSection, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}