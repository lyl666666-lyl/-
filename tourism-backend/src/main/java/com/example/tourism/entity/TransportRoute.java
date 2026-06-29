package com.example.tourism.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("transport_route")
public class TransportRoute {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String routeName;
    private Long startOutletId;
    private Long endOutletId;
    private String status; // ENABLE, DISABLE
    private LocalDateTime createTime;
    private LocalDateTime updateTime;

    @TableField(exist = false)
    private String startOutletName;
    @TableField(exist = false)
    private String endOutletName;
}
