package com.example.tourism.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.tourism.common.Result;
import com.example.tourism.entity.LogisticsOutlet;
import com.example.tourism.service.LogisticsOutletService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LogisticsOutletController {
    private final LogisticsOutletService outletService;

    // 获取所有网点列表 (公开/所有角色)
    @GetMapping("/outlets")
    public Result<List<LogisticsOutlet>> list(@RequestParam(required = false) String name,
                                              @RequestParam(required = false) String status) {
        LambdaQueryWrapper<LogisticsOutlet> qw = new LambdaQueryWrapper<>();
        if (name != null && !name.isBlank()) {
            qw.like(LogisticsOutlet::getName, name);
        }
        if (status != null && !status.isBlank()) {
            qw.eq(LogisticsOutlet::getStatus, status);
        }
        qw.orderByDesc(LogisticsOutlet::getId);
        return Result.ok(outletService.list(qw));
    }

    // 获取单个网点详情
    @GetMapping("/outlets/{id}")
    public Result<LogisticsOutlet> detail(@PathVariable Long id) {
        return Result.ok(outletService.getById(id));
    }

    // 新增网点 (仅管理员)
    @PostMapping("/admin/outlets")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> create(@RequestBody LogisticsOutlet outlet) {
        outlet.setStatus("ENABLE");
        outlet.setCreateTime(LocalDateTime.now());
        outlet.setUpdateTime(LocalDateTime.now());
        outletService.save(outlet);
        return Result.ok();
    }

    // 修改网点 (仅管理员)
    @PutMapping("/admin/outlets/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> update(@PathVariable Long id, @RequestBody LogisticsOutlet body) {
        LogisticsOutlet outlet = outletService.getById(id);
        if (outlet != null) {
            outlet.setName(body.getName());
            outlet.setContactPhone(body.getContactPhone());
            outlet.setAddress(body.getAddress());
            outlet.setUpdateTime(LocalDateTime.now());
            outletService.updateById(outlet);
        }
        return Result.ok();
    }

    // 启用/停用网点 (仅管理员)
    @PutMapping("/admin/outlets/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestParam String status) {
        LogisticsOutlet outlet = outletService.getById(id);
        if (outlet != null) {
            outlet.setStatus(status);
            outlet.setUpdateTime(LocalDateTime.now());
            outletService.updateById(outlet);
        }
        return Result.ok();
    }
}
