package com.example.tourism.controller;

import com.example.tourism.common.Result;
import com.example.tourism.entity.Guide;
import com.example.tourism.service.GuideService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/guides")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class GuideController {
    private final GuideService service;
    @GetMapping public Result<List<Guide>> list(){ return Result.ok(service.list()); }
    @PostMapping public Result<Void> add(@RequestBody Guide g){ if(g.getStatus()==null)g.setStatus("AVAILABLE"); service.save(g); return Result.ok(); }
    @PutMapping("/{id}") public Result<Void> update(@PathVariable Long id,@RequestBody Guide g){ g.setId(id); service.updateById(g); return Result.ok(); }
    @DeleteMapping("/{id}") public Result<Void> delete(@PathVariable Long id){ service.removeById(id); return Result.ok(); }
}