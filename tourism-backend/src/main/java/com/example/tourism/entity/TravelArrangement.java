package com.example.tourism.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("travel_arrangement")
public class TravelArrangement {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long orderId;
    private Long guideId;
    private String batchNo;
    private LocalDateTime departTime;
    private String gatherPlace;
    private String reminder;
    private LocalDateTime createTime;
}