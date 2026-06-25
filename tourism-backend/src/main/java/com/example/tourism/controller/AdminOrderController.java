package com.example.tourism.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.tourism.common.Result;
import com.example.tourism.dto.ReturnOrderRequest;
import com.example.tourism.entity.*;
import com.example.tourism.exception.BusinessException;
import com.example.tourism.service.*;
import com.example.tourism.utils.SecurityUtil;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {
    private final TourOrderService orderService; private final TravelRouteService routeService; private final SysUserService userService; private final OrderLogService logService;

    @GetMapping
    public Result<List<TourOrder>> list(LocalDate startDate, LocalDate endDate, Long routeId, String status, String phone) {
        return Result.ok(filter(startDate,endDate,routeId,status,phone));
    }

    @GetMapping("/{id}") public Result<TourOrder> detail(@PathVariable Long id){ return Result.ok(orderService.getById(id)); }

    @PutMapping("/{id}/confirm")
    public Result<Void> confirm(@PathVariable Long id){ TourOrder o=orderService.getById(id); if(o==null)throw new BusinessException("订单不存在"); if("CANCELED".equals(o.getStatus())) throw new BusinessException("已取消订单不能再次确认"); if("ARCHIVED".equals(o.getStatus())) throw new BusinessException("已归档订单不能修改"); o.setStatus("CONFIRMED"); o.setUpdateTime(LocalDateTime.now()); orderService.updateById(o); log(id,"CONFIRM","管理员确认订单"); return Result.ok(); }

    @PutMapping("/{id}/return")
    public Result<Void> ret(@PathVariable Long id,@Valid @RequestBody ReturnOrderRequest req){ TourOrder o=orderService.getById(id); if(o==null)throw new BusinessException("订单不存在"); if("ARCHIVED".equals(o.getStatus())) throw new BusinessException("已归档订单不能修改"); o.setStatus("RETURNED"); o.setReturnReason(req.getReason()); o.setUpdateTime(LocalDateTime.now()); orderService.updateById(o); log(id,"RETURN",req.getReason()); return Result.ok(); }

    @PutMapping("/{id}/start") public Result<Void> start(@PathVariable Long id){ change(id,"ARRANGED","TRAVELING","START","开始出行"); return Result.ok(); }
    @PutMapping("/{id}/finish") public Result<Void> finish(@PathVariable Long id){ change(id,"TRAVELING","FINISHED","FINISH","完成行程"); return Result.ok(); }
    @PutMapping("/{id}/archive") public Result<Void> archive(@PathVariable Long id){ change(id,"FINISHED","ARCHIVED","ARCHIVE","归档订单"); return Result.ok(); }

    @GetMapping("/statistics")
    public Result<Map<String,Object>> statistics(LocalDate startDate, LocalDate endDate, Long routeId, String status){
        List<TourOrder> list = filter(startDate,endDate,routeId,status,null);
        Map<String,Object> m=new LinkedHashMap<>();
        m.put("orderCount", list.size());
        m.put("peopleCount", list.stream().mapToInt(TourOrder::getPeopleCount).sum());
        m.put("totalAmount", list.stream().map(TourOrder::getTotalAmount).reduce(BigDecimal.ZERO, BigDecimal::add));
        m.put("pendingCount", list.stream().filter(o -> "PENDING_CHECK".equals(o.getStatus())).count());
        m.put("todayTravelCount", list.stream().filter(o -> LocalDate.now().equals(o.getTravelDate())).count());
        return Result.ok(m);
    }

    @GetMapping("/export")
    public void export(LocalDate startDate, LocalDate endDate, Long routeId, String status, HttpServletResponse response) throws IOException {
        List<TourOrder> list = filter(startDate,endDate,routeId,status,null);
        Workbook wb = new XSSFWorkbook(); Sheet sheet = wb.createSheet("订单报表");
        String[] heads={"订单号","游客姓名","联系电话","线路名称","出行日期","人数","金额","订单状态","创建时间"};
        Row h=sheet.createRow(0); for(int i=0;i<heads.length;i++) h.createCell(i).setCellValue(heads[i]);
        int r=1; for(TourOrder o:list){ Row row=sheet.createRow(r++); SysUser u=userService.getById(o.getUserId()); TravelRoute tr=routeService.getById(o.getRouteId());
          row.createCell(0).setCellValue(o.getOrderNo()); row.createCell(1).setCellValue(u==null?"":u.getRealName()); row.createCell(2).setCellValue(o.getContactPhone());
          row.createCell(3).setCellValue(tr==null?"":tr.getRouteName()); row.createCell(4).setCellValue(String.valueOf(o.getTravelDate())); row.createCell(5).setCellValue(o.getPeopleCount());
          row.createCell(6).setCellValue(o.getTotalAmount().doubleValue()); row.createCell(7).setCellValue(o.getStatus()); row.createCell(8).setCellValue(String.valueOf(o.getCreateTime())); }
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition","attachment;filename="+ URLEncoder.encode("orders.xlsx", StandardCharsets.UTF_8));
        wb.write(response.getOutputStream()); wb.close();
    }

    private List<TourOrder> filter(LocalDate startDate, LocalDate endDate, Long routeId, String status, String phone){
        LambdaQueryWrapper<TourOrder> qw=new LambdaQueryWrapper<>(); if(startDate!=null)qw.ge(TourOrder::getTravelDate,startDate); if(endDate!=null)qw.le(TourOrder::getTravelDate,endDate); if(routeId!=null)qw.eq(TourOrder::getRouteId,routeId); if(status!=null&&!status.isBlank())qw.eq(TourOrder::getStatus,status); qw.orderByDesc(TourOrder::getId);
        List<TourOrder> list=orderService.list(qw); if(phone!=null&&!phone.isBlank()) list=list.stream().filter(o->o.getContactPhone()!=null&&o.getContactPhone().contains(phone)).collect(Collectors.toList()); return list;
    }
    private void change(Long id,String from,String to,String action,String remark){ TourOrder o=orderService.getById(id); if(o==null)throw new BusinessException("订单不存在"); if("ARCHIVED".equals(o.getStatus())) throw new BusinessException("已归档订单不能修改"); if(!from.equals(o.getStatus())) throw new BusinessException("状态不允许操作"); o.setStatus(to); o.setUpdateTime(LocalDateTime.now()); orderService.updateById(o); log(id,action,remark); }
    private void log(Long orderId,String action,String remark){ OrderLog l=new OrderLog(); l.setOrderId(orderId); l.setOperatorId(SecurityUtil.current().getId()); l.setOperatorRole("ADMIN"); l.setAction(action); l.setRemark(remark); l.setCreateTime(LocalDateTime.now()); logService.save(l); }
}