package edu.cit.lemslite.Controller;

import edu.cit.lemslite.Service.SchoolYearService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/schoolyear")
@CrossOrigin(origins = "https://lems-lite.vercel.app")
public class SchoolYearController {
    
    @Autowired
    private SchoolYearService schoolYearService;
    
    @GetMapping("/message")
    public String testMessage() {
        return "SchoolYearController is working";
    }
    
    @PostMapping("/save")
    public ResponseEntity<?> saveSchoolYear(@RequestBody Map<String, Object> payload) {
        return schoolYearService.saveSchoolYear(payload);
    }
    
    @GetMapping("/{instiId}")
    public ResponseEntity<?> getSchoolYear(@PathVariable String instiId) {
        return schoolYearService.getSchoolYear(instiId);
    }
    
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateSchoolYear(@PathVariable int id, @RequestBody Map<String, Object> payload) {
        return schoolYearService.updateSchoolYear(id, payload);
    }
}