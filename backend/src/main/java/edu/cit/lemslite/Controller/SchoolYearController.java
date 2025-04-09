package edu.cit.lemslite.Controller;

import edu.cit.lemslite.Entity.SchoolYearEntity;
import edu.cit.lemslite.Service.SchoolYearService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schoolyear")
@CrossOrigin
public class SchoolYearController {

    @Autowired
    private SchoolYearService schoolYearService;

    @PostMapping("/add")
    public SchoolYearEntity addSchoolYear(@RequestBody SchoolYearEntity schoolYear) {
        return schoolYearService.addSchoolYear(schoolYear);
    }

    @GetMapping("/all")
    public List<SchoolYearEntity> getAllSchoolYears() {
        return schoolYearService.getAllSchoolYears();
    }
}