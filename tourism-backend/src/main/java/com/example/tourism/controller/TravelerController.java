package com.example.tourism.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.tourism.common.Result;
import com.example.tourism.entity.Traveler;
import com.example.tourism.exception.BusinessException;
import com.example.tourism.service.TravelerService;
import com.example.tourism.utils.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/travelers")
@RequiredArgsConstructor
@PreAuthorize("hasRole('TOURIST')")
public class TravelerController {
    private final TravelerService service;

    @GetMapping
    public Result<List<Traveler>> list() {
        return Result.ok(service.list(new LambdaQueryWrapper<Traveler>().eq(Traveler::getUserId, SecurityUtil.current().getId()).orderByDesc(Traveler::getId)));
    }

    @PostMapping
    public Result<Void> add(@RequestBody Traveler t) {
        t.setUserId(SecurityUtil.current().getId());
        t.setCreateTime(LocalDateTime.now());
        service.save(t);
        return Result.ok();
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @RequestBody Traveler t) {
        Traveler old = mustOwn(id);
        old.setName(t.getName()); old.setGender(t.getGender()); old.setIdCard(t.getIdCard()); old.setPhone(t.getPhone()); old.setRemark(t.getRemark());
        service.updateById(old);
        return Result.ok();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        mustOwn(id);
        service.removeById(id);
        return Result.ok();
    }

    private Traveler mustOwn(Long id) {
        Traveler t = service.getById(id);
        if (t == null || !t.getUserId().equals(SecurityUtil.current().getId())) throw new BusinessException("只能管理自己的常用出行人");
        return t;
    }
}