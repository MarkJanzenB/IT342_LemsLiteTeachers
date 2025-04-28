package edu.cit.lemslite.Service;

import edu.cit.lemslite.Entity.SchoolYearEntity;
import edu.cit.lemslite.Repository.SchoolYearRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import java.util.Optional;

@Service
public class SchoolYearService {
    
    @Autowired
    private SchoolYearRepository schoolYearRepository;
    
    /**
     * Create or update school year for an institution
     */
    public ResponseEntity<?> saveSchoolYear(Map<String, Object> payload) {
        try {
            String instiId = (String) payload.get("insti_id");
            String startDateStr = (String) payload.get("startDate");
            String endDateStr = (String) payload.get("endDate");
            
            if (instiId == null || startDateStr == null || endDateStr == null) {
                return new ResponseEntity<>("Missing required fields", HttpStatus.BAD_REQUEST);
            }
            
            // Parse dates
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date startDate = dateFormat.parse(startDateStr);
            Date endDate = dateFormat.parse(endDateStr);
            
            // Check if school year already exists for this institution
            Optional<SchoolYearEntity> existingSchoolYear = schoolYearRepository.findByInstiId(instiId);
            
            SchoolYearEntity schoolYear;
            if (existingSchoolYear.isPresent()) {
                // Update existing school year
                schoolYear = existingSchoolYear.get();
                schoolYear.setStartDate(startDate);
                schoolYear.setEndDate(endDate);
            } else {
                // Create new school year
                schoolYear = new SchoolYearEntity();
                schoolYear.setInstiId(instiId); // If the correct method name is different, for example:
                // schoolYear.setInstitutionId(instiId);
                schoolYear.setStartDate(startDate);
                schoolYear.setEndDate(endDate);
            }
            
            // Create year string in format YYYY-YYYY 
            int startYear = Integer.parseInt(new SimpleDateFormat("yyyy").format(startDate));
            int endYear = Integer.parseInt(new SimpleDateFormat("yyyy").format(endDate));
            schoolYear.setYear(startYear + "-" + endYear);
            
            SchoolYearEntity savedSchoolYear = schoolYearRepository.save(schoolYear);
            return new ResponseEntity<>(savedSchoolYear, HttpStatus.OK);
            
        } catch (ParseException e) {
            return new ResponseEntity<>("Invalid date format. Use yyyy-MM-dd", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Get school year for an institution
     */
    public ResponseEntity<?> getSchoolYear(String instiId) {
        try {
            Optional<SchoolYearEntity> schoolYear = schoolYearRepository.findByInstiId(instiId);
            
            if (schoolYear.isPresent()) {
                return new ResponseEntity<>(schoolYear.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>("No school year found for this institution", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Update an existing school year
     */
    public ResponseEntity<?> updateSchoolYear(int id, Map<String, Object> payload) {
        try {
            String startDateStr = (String) payload.get("startDate");
            String endDateStr = (String) payload.get("endDate");
            
            if (startDateStr == null || endDateStr == null) {
                return new ResponseEntity<>("Missing required fields", HttpStatus.BAD_REQUEST);
            }
            
            // Parse dates
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date startDate = dateFormat.parse(startDateStr);
            Date endDate = dateFormat.parse(endDateStr);
            
            Optional<SchoolYearEntity> existingSchoolYear = schoolYearRepository.findById(id);
            
            if (existingSchoolYear.isPresent()) {
                SchoolYearEntity schoolYear = existingSchoolYear.get();
                schoolYear.setStartDate(startDate);
                schoolYear.setEndDate(endDate);
                
                // Update year string
                int startYear = Integer.parseInt(new SimpleDateFormat("yyyy").format(startDate));
                int endYear = Integer.parseInt(new SimpleDateFormat("yyyy").format(endDate));
                schoolYear.setYear(startYear + "-" + endYear);
                
                SchoolYearEntity updatedSchoolYear = schoolYearRepository.save(schoolYear);
                return new ResponseEntity<>(updatedSchoolYear, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("School year not found", HttpStatus.NOT_FOUND);
            }
            
        } catch (ParseException e) {
            return new ResponseEntity<>("Invalid date format. Use yyyy-MM-dd", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}