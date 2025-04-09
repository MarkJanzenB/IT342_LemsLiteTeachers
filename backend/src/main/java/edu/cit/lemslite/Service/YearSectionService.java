package edu.cit.lemslite.Service;

import edu.cit.lemslite.Entity.YearSectionEntity;
import edu.cit.lemslite.Repository.YearSectionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class YearSectionService {
    @Autowired
    YearSectionRepository yrsecrepo;

    private static final Logger log = LoggerFactory.getLogger(YearSectionService.class);

    public ResponseEntity<?> getAllYearSections() {
        log.info("Fetching all year sections");
        List<YearSectionEntity> yearSections = yrsecrepo.findAll();
        return ResponseEntity.ok(yearSections);
    }

    public ResponseEntity<?> getYearSectionById(int yearId) {
        log.info("Fetching year section with ID: {}", yearId);
        Optional<YearSectionEntity> yearSection = yrsecrepo.findById(yearId);

        if (yearSection.isPresent()) {
            return ResponseEntity.ok(yearSection.get());
        } else {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Year section with ID " + yearId + " not found");
        }
    }

    public ResponseEntity<?> getYearSectionsByYearAndSection(String year, String section) {
        log.info("Fetching year sections for year: {} and section: {}", year, section);
        List<YearSectionEntity> yearSections = yrsecrepo.findByYearAndSection(year, section);

        if (yearSections.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("No year sections found for year " + year + " and section " + section);
        }

        return ResponseEntity.ok(yearSections);
    }

//    public ResponseEntity<?> getActiveYearSections() {
//        log.info("Fetching active year sections");
//        List<YearSectionEntity> activeYearSections = yrsecrepo.findByIsActiveTrue();
//
//        if (activeYearSections.isEmpty()) {
//            return ResponseEntity
//                    .status(HttpStatus.NOT_FOUND)
//                    .body("No active year sections found");
//        }
//
//        return ResponseEntity.ok(activeYearSections);
//    }

    public ResponseEntity<?> createYearSection(YearSectionEntity yearSection) {
        log.info("Creating new year section");
        try {
            YearSectionEntity savedYearSection = yrsecrepo.save(yearSection);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedYearSection);
        } catch (Exception e) {
            log.error("Error creating year section: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Error creating year section: " + e.getMessage());
        }
    }

    public ResponseEntity<?> updateYearSection(int yearId, YearSectionEntity newYearSection) {
        log.info("Updating year section with ID: {}", yearId);

        Optional<YearSectionEntity> yearSectionOptional = yrsecrepo.findById(yearId);

        if (yearSectionOptional.isPresent()) {
            YearSectionEntity yearSection = yearSectionOptional.get();

            if (newYearSection.getYear() != null) {
                yearSection.setYear(newYearSection.getYear());
            }

            if (newYearSection.getSection() != null) {
                yearSection.setSection(newYearSection.getSection());
            }

            yearSection.setActive(newYearSection.isActive());

            // Update other fields as needed

            return ResponseEntity.ok(yrsecrepo.save(yearSection));
        } else {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Year section with ID " + yearId + " not found");
        }
    }

    public ResponseEntity<?> deleteYearSection(int yearId) {
        log.info("Deleting year section with ID: {}", yearId);

        if (yrsecrepo.existsById(yearId)) {
            yrsecrepo.deleteById(yearId);
            return ResponseEntity.ok("Year section successfully deleted");
        } else {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Year section with ID " + yearId + " not found");
        }
    }
}