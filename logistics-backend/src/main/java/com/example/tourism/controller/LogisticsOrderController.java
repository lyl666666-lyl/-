package com.example.tourism.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.tourism.common.Result;
import com.example.tourism.entity.LogisticsOrder;
import com.example.tourism.entity.LogisticsOutlet;
import com.example.tourism.entity.TransitLog;
import com.example.tourism.entity.SysUser;
import com.example.tourism.exception.BusinessException;
import com.example.tourism.service.LogisticsOrderService;
import com.example.tourism.service.LogisticsOutletService;
import com.example.tourism.service.TransitLogService;
import com.example.tourism.service.SysUserService;
import com.example.tourism.utils.SecurityUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LogisticsOrderController {
    private final LogisticsOrderService orderService;
    private final TransitLogService transitLogService;
    private final LogisticsOutletService outletService;
    private final SysUserService userService;

    // ================= SENDER (寄件人) APIs =================

    // 提交寄件订单
    @PostMapping("/orders")
    public Result<LogisticsOrder> create(@RequestBody LogisticsOrder order) {
        if (order.getSenderName() == null || order.getSenderName().isBlank() ||
            order.getSenderPhone() == null || order.getSenderPhone().isBlank() ||
            order.getSenderAddress() == null || order.getSenderAddress().isBlank() ||
            order.getReceiverName() == null || order.getReceiverName().isBlank() ||
            order.getReceiverPhone() == null || order.getReceiverPhone().isBlank() ||
            order.getReceiverAddress() == null || order.getReceiverAddress().isBlank() ||
            order.getItemType() == null || order.getItemType().isBlank() ||
            order.getWeight() == null || order.getWeight().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("请填写完整的发收件人信息及重量信息");
        }

        order.setUserId(SecurityUtil.current().getId());
        // 生成运单号
        String timestamp = String.valueOf(System.currentTimeMillis());
        order.setOrderNo("WL" + LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd")) + timestamp.substring(timestamp.length() - 6));
        
        // 计算费用: 起步价 12 元 (含 1kg)，超出部分 3 元/kg
        BigDecimal weight = order.getWeight();
        BigDecimal basePrice = new BigDecimal("12.00");
        BigDecimal price;
        if (weight.compareTo(BigDecimal.ONE) > 0) {
            BigDecimal extraWeight = weight.subtract(BigDecimal.ONE);
            BigDecimal extraPrice = extraWeight.multiply(new BigDecimal("3.00"));
            price = basePrice.add(extraPrice).setScale(2, RoundingMode.HALF_UP);
        } else {
            price = basePrice;
        }
        order.setPrice(price);
        order.setStatus("PENDING_COLLECT");
        order.setIsAbnormal(0);
        order.setCreateTime(LocalDateTime.now());
        order.setUpdateTime(LocalDateTime.now());
        orderService.save(order);

        // 添加物流轨迹
        logTransit(order.getId(), "已下单", "寄件人已提交寄件订单，等待专员上门揽收");

        return Result.ok(order);
    }

    // 查询当前寄件人自己的订单列表
    @GetMapping("/orders/my")
    public Result<List<LogisticsOrder>> listMy(@RequestParam(required = false) String status) {
        LambdaQueryWrapper<LogisticsOrder> qw = new LambdaQueryWrapper<>();
        qw.eq(LogisticsOrder::getUserId, SecurityUtil.current().getId());
        if (status != null && !status.isBlank()) {
            qw.eq(LogisticsOrder::getStatus, status);
        }
        qw.orderByDesc(LogisticsOrder::getId);
        List<LogisticsOrder> list = orderService.list(qw);
        populateOutletNames(list);
        return Result.ok(list);
    }

    // 撤销未揽收的订单
    @PutMapping("/orders/{id}/cancel")
    public Result<Void> cancel(@PathVariable Long id) {
        LogisticsOrder order = orderService.getById(id);
        if (order == null) throw new BusinessException("订单不存在");
        if (!order.getUserId().equals(SecurityUtil.current().getId())) {
            throw new BusinessException("您无权操作此订单");
        }
        if (!"PENDING_COLLECT".equals(order.getStatus())) {
            throw new BusinessException("订单已在处理中，无法撤销");
        }
        order.setStatus("CANCELLED");
        order.setUpdateTime(LocalDateTime.now());
        orderService.updateById(order);

        logTransit(order.getId(), "已撤销", "订单已由寄件人撤销");
        return Result.ok();
    }

    // ================= COURIER/SPECIALIST (物流专员) APIs =================

    // 物流专员查询订单列表
    @GetMapping("/specialist/orders")
    @PreAuthorize("hasRole('SPECIALIST') || hasRole('ADMIN')")
    public Result<List<LogisticsOrder>> listSpecialist(@RequestParam(required = false) String status, @RequestParam(required = false) String orderNo) {
        LambdaQueryWrapper<LogisticsOrder> qw = new LambdaQueryWrapper<>();
        if (status != null && !status.isBlank()) {
            qw.eq(LogisticsOrder::getStatus, status);
        }
        if (orderNo != null && !orderNo.isBlank()) {
            qw.eq(LogisticsOrder::getOrderNo, orderNo);
        }
        qw.orderByDesc(LogisticsOrder::getId);
        List<LogisticsOrder> list = orderService.list(qw);
        populateOutletNames(list);
        return Result.ok(list);
    }

    // 专员上门揽收操作
    @PutMapping("/specialist/orders/{id}/collect")
    @PreAuthorize("hasRole('SPECIALIST') || hasRole('ADMIN')")
    public Result<Void> collect(@PathVariable Long id, @RequestParam Long outletId) {
        LogisticsOrder order = orderService.getById(id);
        if (order == null) throw new BusinessException("订单不存在");
        if (!"PENDING_COLLECT".equals(order.getStatus())) {
            throw new BusinessException("订单已揽收，不可重复操作");
        }
        LogisticsOutlet outlet = outletService.getById(outletId);
        if (outlet == null) throw new BusinessException("指定网点不存在");

        order.setStatus("COLLECTED");
        order.setCurrentOutletId(outletId);
        order.setUpdateTime(LocalDateTime.now());
        orderService.updateById(order);

        SysUser operator = userService.getById(SecurityUtil.current().getId());
        String opName = operator != null ? operator.getRealName() : "物流专员";

        logTransit(order.getId(), "已揽收", "专员【" + opName + "】已上门揽收快件，正发往首站网点：【" + outlet.getName() + "】");
        return Result.ok();
    }

    // 专员网点分拣操作
    @PutMapping("/specialist/orders/{id}/sort")
    @PreAuthorize("hasRole('SPECIALIST') || hasRole('ADMIN')")
    public Result<Void> sort(@PathVariable Long id, @RequestParam Long outletId) {
        LogisticsOrder order = orderService.getById(id);
        if (order == null) throw new BusinessException("订单不存在");
        LogisticsOutlet outlet = outletService.getById(outletId);
        if (outlet == null) throw new BusinessException("指定网点不存在");

        order.setStatus("IN_TRANSIT");
        order.setCurrentOutletId(outletId);
        order.setUpdateTime(LocalDateTime.now());
        orderService.updateById(order);

        SysUser operator = userService.getById(SecurityUtil.current().getId());
        String opName = operator != null ? operator.getRealName() : "物流专员";

        logTransit(order.getId(), "分拣中", "快件已到达网点：【" + outlet.getName() + "】进行分拣，分拣人：【" + opName + "】");
        return Result.ok();
    }

    // 专员更新货物运输中转位置
    @PutMapping("/specialist/orders/{id}/transit")
    @PreAuthorize("hasRole('SPECIALIST') || hasRole('ADMIN')")
    public Result<Void> transit(@PathVariable Long id, @RequestParam String description, @RequestParam(required = false) Long outletId) {
        LogisticsOrder order = orderService.getById(id);
        if (order == null) throw new BusinessException("订单不存在");
        
        order.setStatus("IN_TRANSIT");
        if (outletId != null) {
            order.setCurrentOutletId(outletId);
        }
        order.setUpdateTime(LocalDateTime.now());
        orderService.updateById(order);

        logTransit(order.getId(), "运输中", description);
        return Result.ok();
    }

    // 专员开始派送
    @PutMapping("/specialist/orders/{id}/delivery")
    @PreAuthorize("hasRole('SPECIALIST') || hasRole('ADMIN')")
    public Result<Void> delivery(@PathVariable Long id) {
        LogisticsOrder order = orderService.getById(id);
        if (order == null) throw new BusinessException("订单不存在");

        order.setStatus("DELIVERING");
        order.setUpdateTime(LocalDateTime.now());
        orderService.updateById(order);

        SysUser operator = userService.getById(SecurityUtil.current().getId());
        String opName = operator != null ? operator.getRealName() : "物流专员";
        String opPhone = operator != null ? operator.getPhone() : "";

        logTransit(order.getId(), "派送中", "派送员【" + opName + "】正在为您派送，联系电话: " + opPhone);
        return Result.ok();
    }

    // 专员登记签收
    @PutMapping("/specialist/orders/{id}/sign")
    @PreAuthorize("hasRole('SPECIALIST') || hasRole('ADMIN')")
    public Result<Void> sign(@PathVariable Long id, @RequestParam String receiverSignature) {
        LogisticsOrder order = orderService.getById(id);
        if (order == null) throw new BusinessException("订单不存在");
        if ("SIGNED".equals(order.getStatus())) throw new BusinessException("订单已签收");

        order.setStatus("SIGNED");
        order.setReceiverSignature(receiverSignature);
        order.setSignTime(LocalDateTime.now());
        order.setUpdateTime(LocalDateTime.now());
        orderService.updateById(order);

        logTransit(order.getId(), "已签收", "快件已签收，签收人姓名: " + receiverSignature + "。感谢您的使用！");
        return Result.ok();
    }

    // 专员/管理员登记异常
    @PutMapping("/specialist/orders/{id}/abnormal")
    @PreAuthorize("hasRole('SPECIALIST') || hasRole('ADMIN')")
    public Result<Void> abnormal(@PathVariable Long id, @RequestParam String reason) {
        LogisticsOrder order = orderService.getById(id);
        if (order == null) throw new BusinessException("订单不存在");

        order.setIsAbnormal(1);
        order.setAbnormalReason(reason);
        order.setUpdateTime(LocalDateTime.now());
        orderService.updateById(order);

        logTransit(order.getId(), "异常登记", "快件发生异常变动，原因: " + reason);
        return Result.ok();
    }

    // ================= PUBLIC TRACK (公开轨迹查询) API =================

    // 轨迹查询 (根据单号 + 校验收寄件人姓名)
    @GetMapping("/orders/track")
    public Result<Map<String, Object>> track(@RequestParam String orderNo, @RequestParam(required = false) String senderName) {
        LogisticsOrder order = orderService.getOne(new LambdaQueryWrapper<LogisticsOrder>().eq(LogisticsOrder::getOrderNo, orderNo));
        if (order == null) throw new BusinessException("未找到该运单信息，请核对单号");
        
        // 如果输入了姓名，进行模糊验证
        if (senderName != null && !senderName.isBlank()) {
            boolean match = order.getSenderName().contains(senderName) || order.getReceiverName().contains(senderName);
            if (!match) throw new BusinessException("运单号与姓名不匹配");
        }

        List<TransitLog> logs = transitLogService.list(new LambdaQueryWrapper<TransitLog>()
                .eq(TransitLog::getOrderId, order.getId())
                .orderByDesc(TransitLog::getCreateTime));

        LogisticsOutlet current = order.getCurrentOutletId() != null ? outletService.getById(order.getCurrentOutletId()) : null;
        order.setCurrentOutletName(current != null ? current.getName() : "处理中");

        Map<String, Object> res = new HashMap<>();
        res.put("order", order);
        res.put("logs", logs);
        return Result.ok(res);
    }

    // ================= ADMIN (管理员) APIs =================

    // 管理员获取全部订单列表 (支持各种复杂过滤)
    @GetMapping("/admin/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<List<LogisticsOrder>> listAdmin(@RequestParam(required = false) String orderNo,
                                                  @RequestParam(required = false) String senderName,
                                                  @RequestParam(required = false) String status,
                                                  @RequestParam(required = false) Integer isAbnormal) {
        LambdaQueryWrapper<LogisticsOrder> qw = new LambdaQueryWrapper<>();
        if (orderNo != null && !orderNo.isBlank()) qw.eq(LogisticsOrder::getOrderNo, orderNo);
        if (senderName != null && !senderName.isBlank()) qw.like(LogisticsOrder::getSenderName, senderName);
        if (status != null && !status.isBlank()) qw.eq(LogisticsOrder::getStatus, status);
        if (isAbnormal != null) qw.eq(LogisticsOrder::getIsAbnormal, isAbnormal);
        qw.orderByDesc(LogisticsOrder::getId);

        List<LogisticsOrder> list = orderService.list(qw);
        populateOutletNames(list);
        return Result.ok(list);
    }

    // 统计报表数据
    @GetMapping("/admin/orders/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Map<String, Object>> statistics(@RequestParam(required = false) Long outletId,
                                                  @RequestParam(required = false) String startDate,
                                                  @RequestParam(required = false) String endDate) {
        List<LogisticsOrder> list = filterAdminOrders(outletId, startDate, endDate);
        
        long totalCount = list.size();
        long abnormalCount = list.stream().filter(o -> o.getIsAbnormal() == 1).count();
        long signedCount = list.stream().filter(o -> "SIGNED".equals(o.getStatus())).count();
        long pendingCollectCount = list.stream().filter(o -> "PENDING_COLLECT".equals(o.getStatus())).count();
        double totalAmount = list.stream().mapToDouble(o -> o.getPrice().doubleValue()).sum();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalCount", totalCount);
        stats.put("abnormalCount", abnormalCount);
        stats.put("signedCount", signedCount);
        stats.put("pendingCollectCount", pendingCollectCount);
        stats.put("totalAmount", totalAmount);
        return Result.ok(stats);
    }

    // 导出 Excel 报表
    @GetMapping("/admin/orders/export")
    @PreAuthorize("hasRole('ADMIN')")
    public void export(@RequestParam(required = false) Long outletId,
                       @RequestParam(required = false) String startDate,
                       @RequestParam(required = false) String endDate,
                       HttpServletResponse response) throws IOException {
        List<LogisticsOrder> list = filterAdminOrders(outletId, startDate, endDate);
        populateOutletNames(list);

        Workbook wb = new XSSFWorkbook();
        Sheet sheet = wb.createSheet("物流订单报表");
        
        String[] heads = {"运单号", "寄件人", "寄件电话", "寄件地址", "收件人", "收件电话", "收件地址", "物品类型", "重量(kg)", "运费", "状态", "当前网点", "是否异常", "下单时间"};
        Row h = sheet.createRow(0);
        for (int i = 0; i < heads.length; i++) {
            h.createCell(i).setCellValue(heads[i]);
        }
        
        int r = 1;
        for (LogisticsOrder o : list) {
            Row row = sheet.createRow(r++);
            row.createCell(0).setCellValue(o.getOrderNo());
            row.createCell(1).setCellValue(o.getSenderName());
            row.createCell(2).setCellValue(o.getSenderPhone());
            row.createCell(3).setCellValue(o.getSenderAddress());
            row.createCell(4).setCellValue(o.getReceiverName());
            row.createCell(5).setCellValue(o.getReceiverPhone());
            row.createCell(6).setCellValue(o.getReceiverAddress());
            row.createCell(7).setCellValue(o.getItemType());
            row.createCell(8).setCellValue(o.getWeight().doubleValue());
            row.createCell(9).setCellValue(o.getPrice().doubleValue());
            row.createCell(10).setCellValue(o.getStatus());
            row.createCell(11).setCellValue(o.getCurrentOutletName() != null ? o.getCurrentOutletName() : "未入网点");
            row.createCell(12).setCellValue(o.getIsAbnormal() == 1 ? "是" : "否");
            row.createCell(13).setCellValue(String.valueOf(o.getCreateTime()));
        }
        
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment;filename=" + URLEncoder.encode("logistics_orders.xlsx", StandardCharsets.UTF_8));
        wb.write(response.getOutputStream());
        wb.close();
    }

    // ================= PRIVATE HELPER METHODS =================

    private void logTransit(Long orderId, String nodeName, String description) {
        TransitLog log = new TransitLog();
        log.setOrderId(orderId);
        try {
            log.setOperatorId(SecurityUtil.current().getId());
            SysUser u = userService.getById(log.getOperatorId());
            log.setOperatorName(u != null ? u.getRealName() : "用户");
        } catch (Exception e) {
            log.setOperatorId(null);
            log.setOperatorName("系统");
        }
        log.setNodeName(nodeName);
        log.setDescription(description);
        log.setCreateTime(LocalDateTime.now());
        transitLogService.save(log);
    }

    private void populateOutletNames(List<LogisticsOrder> list) {
        for (LogisticsOrder o : list) {
            if (o.getCurrentOutletId() != null) {
                LogisticsOutlet outlet = outletService.getById(o.getCurrentOutletId());
                if (outlet != null) {
                    o.setCurrentOutletName(outlet.getName());
                }
            }
        }
    }

    private List<LogisticsOrder> filterAdminOrders(Long outletId, String startDate, String endDate) {
        LambdaQueryWrapper<LogisticsOrder> qw = new LambdaQueryWrapper<>();
        if (outletId != null) {
            qw.eq(LogisticsOrder::getCurrentOutletId, outletId);
        }
        if (startDate != null && !startDate.isBlank()) {
            LocalDateTime start = LocalDate.parse(startDate).atStartOfDay();
            qw.ge(LogisticsOrder::getCreateTime, start);
        }
        if (endDate != null && !endDate.isBlank()) {
            LocalDateTime end = LocalDate.parse(endDate).atTime(LocalTime.MAX);
            qw.le(LogisticsOrder::getCreateTime, end);
        }
        qw.orderByDesc(LogisticsOrder::getId);
        return orderService.list(qw);
    }
}
