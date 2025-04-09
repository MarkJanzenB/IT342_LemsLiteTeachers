package edu.cit.lemslite.Service;

import edu.cit.lemslite.Entity.SchoolYearEntity;
import edu.cit.lemslite.Repository.SchoolYearRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SchoolYearService {

    @Autowired
    private SchoolYearRepository schoolYearRepository;

    public SchoolYearEntity addSchoolYear(SchoolYearEntity schoolYear) {
        return schoolYearRepository.save(schoolYear);
    }

    public List<SchoolYearEntity> getAllSchoolYears() {
        return schoolYearRepository.findAll();
    }
}