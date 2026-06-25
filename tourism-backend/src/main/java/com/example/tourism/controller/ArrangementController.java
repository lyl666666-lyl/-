package com.example.tourism.controller;

import com.example.tourism.common.Result;
import com.example.tourism.dto.ArrangementRequest;
import com.example.tourism.entity.*;
import com.example.tourism.exception.BusinessException;
import com.example.tourism.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin/arrangements")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ArrangementController {
    private final TravelArrangementService service; private final TourOrderService orderService;
    @PostMapping public Result<Void> add(@Valid @RequestBody ArrangementRequest req){ TourOrder o=orderService.getById(req.getOrderId()); if(o==null)throw new BusinessException("订单不存在"); if(!"CONFIRMED".equals(o.getStatus())) throw new BusinessException("只有 CONFIRMED 状态订单可以创建出行安排"); TravelArrangement a=new TravelArrangement(); a.setOrderId(req.getOrderId()); a.setGuideId(req.getGuideId()); a.setBatchNo(req.getBatchNo()); a.setDepartTime(req.getDepartTime()); a.setGatherPlace(req.getGatherPlace()); a.setReminder(req.getReminder()); a.setCreateTime(LocalDateTime.now()); service.save(a); o.setStatus("ARRANGED"); o.setUpdateTime(LocalDateTime.now()); orderService.updateById(o); return Result.ok(); }
    @PutMapping("/{id}") public Result<Void> update(@PathVariable Long id,@Valid @RequestBody ArrangementRequest req){ TravelArrangement a=service.getById(id); TourOrder o=orderService.getById(a.getOrderId()); if("ARCHIVED".equals(o.getStatus())) throw new BusinessException("已归档订单不能修改"); a.setGuideId(req.getGuideId()); a.setBatchNo(req.getBatchNo()); a.setDepartTime(req.getDepartTime()); a.setGatherPlace(req.getGatherPlace()); a.setReminder(req.getReminder()); service.updateById(a); return Result.ok(); }
}