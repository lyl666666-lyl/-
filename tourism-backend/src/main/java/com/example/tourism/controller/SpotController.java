package com.example.tourism.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.tourism.common.Result;
import com.example.tourism.entity.ScenicSpot;
import com.example.tourism.service.ScenicSpotService;
import com.example.tourism.utils.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
public class SpotController {
    private final ScenicSpotService service;

    @GetMapping("/api/spots")
    public Result<Page<ScenicSpot>> list(@RequestParam(defaultValue = "1") long page, @RequestParam(defaultValue = "10") long size,
      String name, String location, String status) {
        LambdaQueryWrapper<ScenicSpot> qw = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(name)) qw.like(ScenicSpot::getName, name);
        if (StringUtils.hasText(location)) qw.like(ScenicSpot::getLocation, location);
        if (StringUtils.hasText(status) && SecurityUtil.isAdmin()) qw.eq(ScenicSpot::getStatus, status);
        if (!SecurityUtil.isAdmin()) qw.eq(ScenicSpot::getStatus, "ENABLE");
        qw.orderByDesc(ScenicSpot::getId);
        return Result.ok(service.page(new Page<>(page, size), qw));
    }

    @GetMapping("/api/spots/{id}")
    public Result<ScenicSpot> detail(@PathVariable Long id) { return Result.ok(service.getById(id)); }

    @PostMapping("/api/admin/spots")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> add(@RequestBody ScenicSpot spot) { spot.setCreateTime(LocalDateTime.now()); if (spot.getStatus()==null) spot.setStatus("ENABLE"); service.save(spot); return Result.ok(); }

    @PutMapping("/api/admin/spots/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> update(@PathVariable Long id, @RequestBody ScenicSpot spot) { spot.setId(id); service.updateById(spot); return Result.ok(); }

    @DeleteMapping("/api/admin/spots/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> delete(@PathVariable Long id) { service.removeById(id); return Result.ok(); }

    @PutMapping("/api/admin/spots/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> status(@PathVariable Long id, @RequestParam String status) { ScenicSpot s = service.getById(id); s.setStatus(status); service.updateById(s); return Result.ok(); }
}