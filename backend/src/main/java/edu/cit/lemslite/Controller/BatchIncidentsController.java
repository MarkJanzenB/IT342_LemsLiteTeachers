package edu.cit.lemslite.Controller;

import edu.cit.lemslite.Entity.BatchIncidentsEntity;
import edu.cit.lemslite.Service.BatchIncidentsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/batch-incidents")
public class BatchIncidentsController {

    @Autowired
    private BatchIncidentsService batchIncidentsService;

    // Get all incidents
    @GetMapping
    public ResponseEntity<List<BatchIncidentsEntity>> getAllBatchIncidents() {
        List<BatchIncidentsEntity> incidents = batchIncidentsService.getAllBatchIncidents();
        return new ResponseEntity<>(incidents, HttpStatus.OK);
    }

    // Get incident by ID
    @GetMapping("/{id}")
    public ResponseEntity<BatchIncidentsEntity> getBatchIncidentById(@PathVariable int id) {
        Optional<BatchIncidentsEntity> incident = batchIncidentsService.getBatchIncidentById(id);
        return incident.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Create new incident
    @PostMapping
    public ResponseEntity<BatchIncidentsEntity> createBatchIncident(@RequestBody BatchIncidentsEntity incident) {
        BatchIncidentsEntity newIncident = batchIncidentsService.saveBatchIncident(incident);
        return new ResponseEntity<>(newIncident, HttpStatus.CREATED);
    }

    // Update incident
    @PutMapping("/{id}")
    public ResponseEntity<BatchIncidentsEntity> updateBatchIncident(@PathVariable int id,
                                                                    @RequestBody BatchIncidentsEntity incident) {
        if (!batchIncidentsService.existsById(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        incident.setId(id);
        BatchIncidentsEntity updatedIncident = batchIncidentsService.saveBatchIncident(incident);
        return new ResponseEntity<>(updatedIncident, HttpStatus.OK);
    }

    // Delete incident
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBatchIncident(@PathVariable int id) {
        if (!batchIncidentsService.existsById(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        batchIncidentsService.deleteBatchIncident(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Get incidents by batch ID
    @GetMapping("/batch/{batchId}")
    public ResponseEntity<List<BatchIncidentsEntity>> getIncidentsByBatchId(@PathVariable String batchId) {
        List<BatchIncidentsEntity> incidents = batchIncidentsService.findByBatchId(batchId);
        return new ResponseEntity<>(incidents, HttpStatus.OK);
    }
}