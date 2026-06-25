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
import java.math.BigDecimal;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final TourOrderService orderService;
    private final TravelRouteService routeService;
    private final TourPackageService packageService;
    private final TravelerService travelerService;
    private final OrderTravelerService orderTravelerService;
    private final TravelArrangementService arrangementService;
    private final OrderLogService logService;

    @PostMapping @PreAuthorize("hasRole('TOURIST')")
    public Result<Void> create(@Valid @RequestBody OrderCreateRequest req) {
        TourOrder order = buildOrder(req.getRouteId(), req.getPackageId(), req.getTravelDate(), req.getPeopleCount(), req.getContactName(), req.getContactPhone(), req.getTravelerIds(), true);
        orderService.save(order);
        saveTravelers(order.getId(), req.getTravelerIds());
        log(order.getId(), "CREATE", "游客提交预订");
        return Result.ok();
    }

    @GetMapping("/my") @PreAuthorize("hasRole('TOURIST')")
    public Result<List<TourOrder>> my(){ return Result.ok(orderService.list(new LambdaQueryWrapper<TourOrder>().eq(TourOrder::getUserId, SecurityUtil.current().getId()).orderByDesc(TourOrder::getId))); }

    @GetMapping("/{id}")
    public Result<Map<String,Object>> detail(@PathVariable Long id){
        TourOrder o = orderService.getById(id); if(o==null) throw new BusinessException("订单不存在");
        if(!SecurityUtil.isAdmin() && !o.getUserId().equals(SecurityUtil.current().getId())) throw new BusinessException("游客不能操作别人的订单");
        Map<String,Object> m = new LinkedHashMap<>();
        m.put("order", o);
        m.put("route", routeService.getById(o.getRouteId()));
        m.put("packageInfo", o.getPackageId()==null?null:packageService.getById(o.getPackageId()));
        m.put("travelers", orderTravelerService.list(new LambdaQueryWrapper<OrderTraveler>().eq(OrderTraveler::getOrderId, id)));
        m.put("arrangement", arrangementService.getOne(new LambdaQueryWrapper<TravelArrangement>().eq(TravelArrangement::getOrderId, id), false));
        return Result.ok(m);
    }

    @PutMapping("/{id}") @PreAuthorize("hasRole('TOURIST')")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody OrderUpdateRequest req) {
        TourOrder old = mustOwn(id);
        if (!List.of("PENDING_CHECK","RETURNED").contains(old.getStatus())) throw new BusinessException("只有 PENDING_CHECK 或 RETURNED 订单允许游客修改");
        TourOrder n = buildOrder(old.getRouteId(), req.getPackageId(), req.getTravelDate(), req.getPeopleCount(), req.getContactName(), req.getContactPhone(), req.getTravelerIds(), false);
        old.setPackageId(n.getPackageId()); old.setTravelDate(n.getTravelDate()); old.setPeopleCount(n.getPeopleCount()); old.setTotalAmount(n.getTotalAmount());
        old.setContactName(n.getContactName()); old.setContactPhone(n.getContactPhone()); old.setStatus("PENDING_CHECK"); old.setReturnReason(null); old.setUpdateTime(LocalDateTime.now());
        orderService.updateById(old);
        orderTravelerService.remove(new LambdaQueryWrapper<OrderTraveler>().eq(OrderTraveler::getOrderId, id));
        saveTravelers(id, req.getTravelerIds());
        log(id, "UPDATE", "游客修改订单");
        return Result.ok();
    }

    @DeleteMapping("/{id}/cancel") @PreAuthorize("hasRole('TOURIST')")
    public Result<Void> cancel(@PathVariable Long id) {
        TourOrder o = mustOwn(id);
        if (!"PENDING_CHECK".equals(o.getStatus())) throw new BusinessException("游客只能取消 PENDING_CHECK 状态订单");
        o.setStatus("CANCELED"); o.setUpdateTime(LocalDateTime.now()); orderService.updateById(o); log(id, "CANCEL", "游客取消订单");
        return Result.ok();
    }

    @GetMapping("/{id}/arrangement")
    public Result<TravelArrangement> arrangement(@PathVariable Long id) {
        TourOrder o = orderService.getById(id);
        if(o==null) throw new BusinessException("订单不存在");
        if(!SecurityUtil.isAdmin() && !o.getUserId().equals(SecurityUtil.current().getId())) throw new BusinessException("游客不能查看别人的出行安排");
        return Result.ok(arrangementService.getOne(new LambdaQueryWrapper<TravelArrangement>().eq(TravelArrangement::getOrderId, id), false));
    }

    private TourOrder mustOwn(Long id){ TourOrder o=orderService.getById(id); if(o==null||!o.getUserId().equals(SecurityUtil.current().getId())) throw new BusinessException("游客不能操作别人的订单"); return o; }

    private TourOrder buildOrder(Long routeId, Long packageId, LocalDate date, Integer people, String name, String phone, List<Long> travelerIds, boolean createNo) {
        if(date.isBefore(LocalDate.now())) throw new BusinessException("出行日期不能早于当前日期");
        if(people == null || people <= 0) throw new BusinessException("预订人数必须大于0");
        if(travelerIds == null || travelerIds.size() != people) throw new BusinessException("订单人数必须和选择的出行人数量一致");
        TravelRoute route = routeService.getById(routeId);
        if(route == null || !"ON_SALE".equals(route.getStatus())) throw new BusinessException("线路已下架，不能预订");
        BigDecimal price = route.getPrice();
        if(packageId != null){ TourPackage p = packageService.getById(packageId); if(p==null || !p.getRouteId().equals(routeId)) throw new BusinessException("套餐必须绑定线路"); price = p.getPrice(); }
        Long userId = SecurityUtil.current().getId();
        for(Long tid: travelerIds){ Traveler t=travelerService.getById(tid); if(t==null || !t.getUserId().equals(userId)) throw new BusinessException("出行人信息错误"); }
        TourOrder order = new TourOrder();
        if(createNo) order.setOrderNo("TO" + DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS").format(LocalDateTime.now()) + (int)(Math.random()*90+10));
        order.setUserId(userId); order.setRouteId(routeId); order.setPackageId(packageId); order.setTravelDate(date); order.setPeopleCount(people);
        order.setTotalAmount(price.multiply(BigDecimal.valueOf(people))); order.setContactName(name); order.setContactPhone(phone); order.setStatus("PENDING_CHECK");
        order.setCreateTime(LocalDateTime.now()); order.setUpdateTime(LocalDateTime.now());
        return order;
    }

    private void saveTravelers(Long orderId, List<Long> ids){ for(Long id: ids){ Traveler t=travelerService.getById(id); OrderTraveler ot=new OrderTraveler(); ot.setOrderId(orderId); ot.setTravelerId(id); ot.setTravelerName(t.getName()); ot.setIdCard(t.getIdCard()); ot.setPhone(t.getPhone()); orderTravelerService.save(ot);} }
    private void log(Long orderId,String action,String remark){ OrderLog l=new OrderLog(); l.setOrderId(orderId); l.setOperatorId(SecurityUtil.current().getId()); l.setOperatorRole(SecurityUtil.current().getRole()); l.setAction(action); l.setRemark(remark); l.setCreateTime(LocalDateTime.now()); logService.save(l); }
}
