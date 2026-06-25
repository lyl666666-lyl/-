package com.example.tourism.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.tourism.common.Result;
import com.example.tourism.entity.*;
import com.example.tourism.service.*;
import com.example.tourism.utils.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequiredArgsConstructor
public class RouteController {
    private final TravelRouteService routeService;
    private final ScenicSpotService spotService;
    private final TourPackageService packageService;

    @GetMapping("/api/routes")
    public Result<Page<TravelRoute>> list(@RequestParam(defaultValue = "1") long page, @RequestParam(defaultValue = "10") long size,
      String keyword, Long spotId, Integer days, String status, java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice) {
        LambdaQueryWrapper<TravelRoute> qw = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(keyword)) qw.like(TravelRoute::getRouteName, keyword);
        if (spotId != null) qw.eq(TravelRoute::getSpotId, spotId);
        if (days != null) qw.eq(TravelRoute::getDays, days);
        if (minPrice != null) qw.ge(TravelRoute::getPrice, minPrice);
        if (maxPrice != null) qw.le(TravelRoute::getPrice, maxPrice);
        if (StringUtils.hasText(status) && SecurityUtil.isAdmin()) qw.eq(TravelRoute::getStatus, status);
        if (!SecurityUtil.isAdmin()) qw.eq(TravelRoute::getStatus, "ON_SALE");
        qw.orderByDesc(TravelRoute::getId);
        return Result.ok(routeService.page(new Page<>(page, size), qw));
    }

    @GetMapping("/api/routes/{id}")
    public Result<Map<String,Object>> detail(@PathVariable Long id) {
        TravelRoute route = routeService.getById(id);
        Map<String,Object> map = new LinkedHashMap<>();
        map.put("route", route);
        map.put("spot", route == null ? null : spotService.getById(route.getSpotId()));
        map.put("packages", packageService.list(new LambdaQueryWrapper<TourPackage>().eq(TourPackage::getRouteId, id).eq(TourPackage::getStatus, "ENABLE")));
        return Result.ok(map);
    }

    @PostMapping("/api/admin/routes") @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> add(@RequestBody TravelRoute r) { r.setCreateTime(LocalDateTime.now()); r.setUpdateTime(LocalDateTime.now()); if(r.getStatus()==null)r.setStatus("ON_SALE"); routeService.save(r); return Result.ok(); }
    @PutMapping("/api/admin/routes/{id}") @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> update(@PathVariable Long id,@RequestBody TravelRoute r) { r.setId(id); r.setUpdateTime(LocalDateTime.now()); routeService.updateById(r); return Result.ok(); }
    @DeleteMapping("/api/admin/routes/{id}") @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> delete(@PathVariable Long id) { routeService.removeById(id); return Result.ok(); }
    @PutMapping("/api/admin/routes/{id}/off-sale") @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> off(@PathVariable Long id) { TravelRoute r=routeService.getById(id); r.setStatus("OFF_SALE"); routeService.updateById(r); return Result.ok(); }
    @PutMapping("/api/admin/routes/{id}/on-sale") @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> on(@PathVariable Long id) { TravelRoute r=routeService.getById(id); r.setStatus("ON_SALE"); routeService.updateById(r); return Result.ok(); }
}