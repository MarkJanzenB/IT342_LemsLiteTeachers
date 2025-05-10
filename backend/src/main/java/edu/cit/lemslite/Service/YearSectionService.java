package edu.cit.lemslite.Service;

import edu.cit.lemslite.Entity.YearSectionEntity;
import edu.cit.lemslite.Repository.YearSectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class YearSectionService {

    @Autowired
    private YearSectionRepository yearSectionRepository;

    // Get all Year Sections
    public List<YearSectionEntity> getAllYearSections() {
        return yearSectionRepository.findAll();
    }

    // Get Year Section by ID
    public Optional<YearSectionEntity> getYearSectionById(int id) {
        return yearSectionRepository.findById(id);
    }

    // Create new Year Section
    public YearSectionEntity saveYearSection(YearSectionEntity yearSectionEntity) {
        // Before saving, combine year and section to create yearsect
        yearSectionEntity.setYearsect(yearSectionEntity.getYear() + "-" + yearSectionEntity.getSection());
        return yearSectionRepository.save(yearSectionEntity);
    }

    // Update Year Section
    public YearSectionEntity updateYearSection(YearSectionEntity yearSectionEntity) {
        // Make sure we update the yearsect field when updating
        yearSectionEntity.setYearsect(yearSectionEntity.getYear() + "-" + yearSectionEntity.getSection());
        return yearSectionRepository.save(yearSectionEntity);
    }

    // Delete Year Section
    public void deleteYearSection(int id) {
        yearSectionRepository.deleteById(id);
    }

    // Find by year
    public List<YearSectionEntity> findByYear(int year) {
        return yearSectionRepository.findByYear(year);
    }

    // Find by section
    public List<YearSectionEntity> findBySection(String section) {
        return yearSectionRepository.findBySection(section);
    }

    // Find by yearsect
    public YearSectionEntity findByYearsect(String yearsect) {
        return yearSectionRepository.findByYearsect(yearsect);
    }
}