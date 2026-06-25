package com.example.tourism.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.tourism.entity.OrderLog;
import com.example.tourism.mapper.OrderLogMapper;
import com.example.tourism.service.OrderLogService;
import org.springframework.stereotype.Service;

@Service
public class OrderLogServiceImpl extends ServiceImpl<OrderLogMapper, OrderLog> implements OrderLogService {
}