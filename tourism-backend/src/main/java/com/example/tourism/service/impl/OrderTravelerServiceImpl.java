package com.example.tourism.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.tourism.entity.OrderTraveler;
import com.example.tourism.mapper.OrderTravelerMapper;
import com.example.tourism.service.OrderTravelerService;
import org.springframework.stereotype.Service;

@Service
public class OrderTravelerServiceImpl extends ServiceImpl<OrderTravelerMapper, OrderTraveler> implements OrderTravelerService {
}