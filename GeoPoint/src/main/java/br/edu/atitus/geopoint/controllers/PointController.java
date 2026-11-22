package br.edu.atitus.geopoint.controllers;

import br.edu.atitus.geopoint.dtos.PointRequest;
import br.edu.atitus.geopoint.entities.PointEntity;
import br.edu.atitus.geopoint.services.PointService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/points")
@CrossOrigin(origins = "*")
public class PointController {
    private final PointService service;

    public PointController(PointService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<PointEntity> insertPoint(
            @RequestBody PointRequest pointRequest) {

        PointEntity point = service.insert(pointRequest);
        return  ResponseEntity.status(201).body(point);
    }

    @GetMapping
    public ResponseEntity<List<PointEntity>> listPoints() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PointEntity> getPoint(@PathVariable String id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PointEntity> updatePoint(
            @PathVariable String id,
            @RequestBody PointRequest pointRequest) {

        return ResponseEntity.ok(service.update(id, pointRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePoint(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}