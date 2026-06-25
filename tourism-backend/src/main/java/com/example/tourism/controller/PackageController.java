package com.example.tourism.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.tourism.common.Result;
import com.example.tourism.entity.TourPackage;
import com.example.tourism.service.TourPackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class PackageController {
    private final TourPackageService service;
    @GetMapping("/api/packages")
    public Result<List<TourPackage>> list(Long routeId) {
        LambdaQueryWrapper<TourPackage> qw = new LambdaQueryWrapper<>();
        if (routeId != null) qw.eq(TourPackage::getRouteId, routeId);
        qw.eq(TourPackage::getStatus, "ENABLE").orderByDesc(TourPackage::getId);
        return Result.ok(service.list(qw));
    }
    @GetMapping("/api/packages/{id}") public Result<TourPackage> detail(@PathVariable Long id){ return Result.ok(service.getById(id));}
    @PostMapping("/api/admin/packages") @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> add(@RequestBody TourPackage p){ p.setCreateTime(LocalDateTime.now()); if(p.getStatus()==null)p.setStatus("ENABLE"); service.save(p); return Result.ok();}
    @PutMapping("/api/admin/packages/{id}") @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> update(@PathVariable Long id,@RequestBody TourPackage p){ p.setId(id); service.updateById(p); return Result.ok();}
    @DeleteMapping("/api/admin/packages/{id}") @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> delete(@PathVariable Long id){ service.removeById(id); return Result.ok();}
}