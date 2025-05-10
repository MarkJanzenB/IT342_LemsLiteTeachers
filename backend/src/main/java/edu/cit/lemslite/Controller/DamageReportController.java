package edu.cit.lemslite.Controller;

import edu.cit.lemslite.Entity.DamageReportEntity;
import edu.cit.lemslite.Service.DamageReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/damageReports")
@CrossOrigin(origins = "https://lems-lite.vercel.app")
public class DamageReportController {

    @Autowired
    private DamageReportService damageReportService;

    @GetMapping
    public List<DamageReportEntity> getAllDamageReports() {
        return damageReportService.getAllDamageReports();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DamageReportEntity> getDamageReportById(@PathVariable Long id) {
        DamageReportEntity damageReport = damageReportService.getDamageReportById(id);
        if (damageReport != null) {
            return ResponseEntity.ok(damageReport);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/add")
    public DamageReportEntity createDamageReport(@RequestBody DamageReportEntity damageReport) {
        return damageReportService.createDamageReport(damageReport);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DamageReportEntity> updateDamageReport(@PathVariable Long id, @RequestBody DamageReportEntity damageReportDetails) {
        DamageReportEntity updatedDamageReport = damageReportService.updateDamageReport(id, damageReportDetails);
        if (updatedDamageReport != null) {
            return ResponseEntity.ok(updatedDamageReport);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDamageReport(@PathVariable Long id) {
        damageReportService.deleteDamageReport(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/linechart")
    public ResponseEntity<Map<String, Map<String, List<Integer>>>> getMonthlyDamageCounts() {
        return ResponseEntity.ok(damageReportService.getMonthlyCountsPerSectionPerYear());
    }

}