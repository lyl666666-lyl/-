package com.example.tourism.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.tourism.entity.TransportRoute;
import com.example.tourism.mapper.TransportRouteMapper;
import com.example.tourism.service.TransportRouteService;
import org.springframework.stereotype.Service;

@Service
public class TransportRouteServiceImpl extends ServiceImpl<TransportRouteMapper, TransportRoute> implements TransportRouteService {
}
