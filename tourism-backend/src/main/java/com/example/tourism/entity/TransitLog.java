package com.example.tourism.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("transit_log")
public class TransitLog {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long orderId;
    private Long operatorId;
    private String operatorName;
    private String nodeName;
    private String description;
    private LocalDateTime createTime;
}
