package com.example.tourism.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.tourism.common.Result;
import com.example.tourism.dto.*;
import com.example.tourism.entity.*;
import com.example.tourism.exception.BusinessException;
import com.example.tourism.service.*;
import com.example.tourism.utils.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class AfterSaleController {
    private final AfterSaleService service; private final TourOrderService orderService;
    @PostMapping("/api/after-sales") @PreAuthorize("hasRole('TOURIST')")
    public Result<Void> add(@Valid @RequestBody AfterSaleRequest req){ TourOrder o=orderService.getById(req.getOrderId()); if(o==null||!o.getUserId().equals(SecurityUtil.current().getId())) throw new BusinessException("游客只能对自己的订单提交售后"); AfterSale a=new AfterSale(); a.setOrderId(req.getOrderId()); a.setUserId(SecurityUtil.current().getId()); a.setType(req.getType()); a.setContent(req.getContent()); a.setStatus("PENDING"); a.setCreateTime(LocalDateTime.now()); a.setUpdateTime(LocalDateTime.now()); service.save(a); return Result.ok(); }
    @GetMapping("/api/after-sales/my") @PreAuthorize("hasRole('TOURIST')") public Result<List<AfterSale>> my(){ return Result.ok(service.list(new LambdaQueryWrapper<AfterSale>().eq(AfterSale::getUserId, SecurityUtil.current().getId()).orderByDesc(AfterSale::getId))); }
    @GetMapping("/api/admin/after-sales") @PreAuthorize("hasRole('ADMIN')") public Result<List<AfterSale>> admin(){ return Result.ok(service.list(new LambdaQueryWrapper<AfterSale>().orderByDesc(AfterSale::getId))); }
    @PutMapping("/api/admin/after-sales/{id}/reply") @PreAuthorize("hasRole('ADMIN')") public Result<Void> reply(@PathVariable Long id,@Valid @RequestBody ReplyAfterSaleRequest req){ AfterSale a=service.getById(id); a.setStatus(req.getStatus()); a.setReply(req.getReply()); a.setUpdateTime(LocalDateTime.now()); service.updateById(a); return Result.ok(); }
}