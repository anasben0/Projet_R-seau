package com.anasvalisoa.backend.controller;

import com.anasvalisoa.backend.entity.Demo;
import com.anasvalisoa.backend.repository.DemoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/demo")
public class DemoController {

    private final DemoRepository repo;

    public DemoController(DemoRepository repo) {
        this.repo = repo;
    }

    // GET /api/demo -> liste tous
    @GetMapping
    public List<Demo> findAll() {
        return repo.findAll();
    }

    // GET /api/demo/{id} -> un élément
    @GetMapping("/{id}")
    public ResponseEntity<Demo> findOne(@PathVariable Long id) {
        return repo.findById(id)
                   .map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/demo -> crée (body: { "name": "..." })
    @PostMapping
    public ResponseEntity<Demo> create(@RequestBody Demo payload) {
        if (payload.getName() == null || payload.getName().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        Demo saved = repo.save(new Demo(payload.getName()));
        return ResponseEntity.ok(saved);
    }

    // PUT /api/demo/{id} -> met à jour le name
    @PutMapping("/{id}")
    public ResponseEntity<Demo> update(@PathVariable Long id, @RequestBody Demo payload) {
        return repo.findById(id)
                .map(existing -> {
                    if (payload.getName() != null && !payload.getName().isBlank()) {
                        existing.setName(payload.getName());
                    }
                    return ResponseEntity.ok(repo.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/demo/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
