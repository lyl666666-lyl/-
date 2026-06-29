package com.example.tourism.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.tourism.entity.LogisticsOrder;
import com.example.tourism.mapper.LogisticsOrderMapper;
import com.example.tourism.service.LogisticsOrderService;
import org.springframework.stereotype.Service;

@Service
public class LogisticsOrderServiceImpl extends ServiceImpl<LogisticsOrderMapper, LogisticsOrder> implements LogisticsOrderService {
}
