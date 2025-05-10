package edu.cit.lemslite.Service;

import edu.cit.lemslite.Entity.DamageReportEntity;
import edu.cit.lemslite.Entity.YearSectionEntity;
import edu.cit.lemslite.Repository.DamageReportRepository;
import edu.cit.lemslite.Repository.YearSectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DamageReportService {

    @Autowired
    private DamageReportRepository damageReportRepository;
    
    @Autowired
    private YearSectionRepository yearSecRepo;

    public List<DamageReportEntity> getAllDamageReports() {
        return damageReportRepository.findAll();
    }

    public DamageReportEntity getDamageReportById(Long id) {
        return damageReportRepository.findById(id).orElse(null);
    }

    public DamageReportEntity createDamageReport(DamageReportEntity damageReport) {
    	YearSectionEntity yearSec = yearSecRepo.findById(damageReport.getYearSec().getYrsecId()).orElseThrow();
    	damageReport.setYearSec(yearSec);
        return damageReportRepository.save(damageReport);
    }

    public DamageReportEntity updateDamageReport(Long id, DamageReportEntity damageReportDetails) {
        DamageReportEntity damageReport = damageReportRepository.findById(id).orElse(null);
        if (damageReport != null) {
            damageReport.setSerialNo(damageReportDetails.getSerialNo());
            damageReport.setItemName(damageReportDetails.getItemName());
            damageReport.setDateBorrowed(damageReportDetails.getDateBorrowed());
            damageReport.setSubject(damageReportDetails.getSubject());
            damageReport.setYearSec(damageReportDetails.getYearSec());
            damageReport.setInstructor(damageReportDetails.getInstructor());
            damageReport.setPhoto(damageReportDetails.getPhoto());
            damageReport.setAccountable(damageReportDetails.getAccountable());
            damageReport.setIncidentStatus(damageReportDetails.getIncidentStatus());
            return damageReportRepository.save(damageReport);
        }
        return null;
    }

    public void deleteDamageReport(Long id) {
        damageReportRepository.deleteById(id);
    }
    
    public Map<String, Map<String, List<Integer>>> getMonthlyCountsPerSectionPerYear(){
    	List<DamageReportEntity> allReports = damageReportRepository.findAll();
    	
    	Map<String, Map<String, List<Integer>>> result = new HashMap<>();
    	
    	for (DamageReportEntity report : allReports) {
    		YearSectionEntity yse = report.getYearSec();
    		int year = yse.getYear();
    		String section = yse.getSection();
    		LocalDate date = report.getDateBorrowed();
    		
    		int month = date.getMonthValue();
    		
    		String yearLabel = switch (year){
    			case 1 -> "1st year";
    			case 2 -> "2nd year";
    			case 3 -> "3rd year";
    			case 4 -> "4th year";
    			default -> "Uknown";
    		};
    		result.putIfAbsent(yearLabel, new HashMap<>());
    		Map<String, List<Integer>> sectionMap = result.get(yearLabel);
    		
    		sectionMap.putIfAbsent(section, new ArrayList<>(List.of(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)));
    		List<Integer> counts = sectionMap.get(section);
    		
    		counts.set(month - 1, counts.get(month-1)+1);
    	}
    	
    	return result;
    }
}