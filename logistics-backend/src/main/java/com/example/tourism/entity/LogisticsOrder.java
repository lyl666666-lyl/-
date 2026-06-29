package com.example.tourism.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("logistics_order")
public class LogisticsOrder {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String orderNo;
    private Long userId;
    private String senderName;
    private String senderPhone;
    private String senderAddress;
    private String receiverName;
    private String receiverPhone;
    private String receiverAddress;
    private String itemType;
    private BigDecimal weight;
    private BigDecimal price;
    private String status; // PENDING_COLLECT, COLLECTED, IN_TRANSIT, DELIVERING, SIGNED, CANCELLED
    private Long currentOutletId;
    private Integer isAbnormal; // 0-normal, 1-abnormal
    private String abnormalReason;
    private String receiverSignature;
    private LocalDateTime signTime;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;

    @TableField(exist = false)
    private String currentOutletName;
}
