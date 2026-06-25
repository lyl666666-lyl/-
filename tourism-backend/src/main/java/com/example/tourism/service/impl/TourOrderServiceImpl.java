package com.example.tourism.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.tourism.entity.TourOrder;
import com.example.tourism.mapper.TourOrderMapper;
import com.example.tourism.service.TourOrderService;
import org.springframework.stereotype.Service;

@Service
public class TourOrderServiceImpl extends ServiceImpl<TourOrderMapper, TourOrder> implements TourOrderService {
}