package com.example.tourism.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.tourism.common.Result;
import com.example.tourism.entity.LogisticsOutlet;
import com.example.tourism.entity.TransportRoute;
import com.example.tourism.service.LogisticsOutletService;
import com.example.tourism.service.TransportRouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TransportRouteController {
    private final TransportRouteService routeService;
    private final LogisticsOutletService outletService;

    // 获取所有路线列表 (公开/所有角色)
    @GetMapping("/routes")
    public Result<List<TransportRoute>> list(@RequestParam(required = false) Long startOutletId,
                                             @RequestParam(required = false) Long endOutletId,
                                             @RequestParam(required = false) String status) {
        LambdaQueryWrapper<TransportRoute> qw = new LambdaQueryWrapper<>();
        if (startOutletId != null) {
            qw.eq(TransportRoute::getStartOutletId, startOutletId);
        }
        if (endOutletId != null) {
            qw.eq(TransportRoute::getEndOutletId, endOutletId);
        }
        if (status != null && !status.isBlank()) {
            qw.eq(TransportRoute::getStatus, status);
        }
        qw.orderByDesc(TransportRoute::getId);
        List<TransportRoute> list = routeService.list(qw);
        for (TransportRoute r : list) {
            LogisticsOutlet start = outletService.getById(r.getStartOutletId());
            LogisticsOutlet end = outletService.getById(r.getEndOutletId());
            if (start != null) r.setStartOutletName(start.getName());
            if (end != null) r.setEndOutletName(end.getName());
        }
        return Result.ok(list);
    }

    // 新增路线 (仅管理员)
    @PostMapping("/admin/routes")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> create(@RequestBody TransportRoute route) {
        route.setStatus("ENABLE");
        route.setCreateTime(LocalDateTime.now());
        route.setUpdateTime(LocalDateTime.now());
        routeService.save(route);
        return Result.ok();
    }

    // 修改路线 (仅管理员)
    @PutMapping("/admin/routes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> update(@PathVariable Long id, @RequestBody TransportRoute body) {
        TransportRoute route = routeService.getById(id);
        if (route != null) {
            route.setRouteName(body.getRouteName());
            route.setStartOutletId(body.getStartOutletId());
            route.setEndOutletId(body.getEndOutletId());
            route.setUpdateTime(LocalDateTime.now());
            routeService.updateById(route);
        }
        return Result.ok();
    }

    // 启用/停用路线 (仅管理员)
    @PutMapping("/admin/routes/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestParam String status) {
        TransportRoute route = routeService.getById(id);
        if (route != null) {
            route.setStatus(status);
            route.setUpdateTime(LocalDateTime.now());
            routeService.updateById(route);
        }
        return Result.ok();
    }
}
