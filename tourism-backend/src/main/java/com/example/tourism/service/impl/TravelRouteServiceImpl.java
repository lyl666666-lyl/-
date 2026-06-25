package com.example.tourism.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.tourism.entity.TravelRoute;
import com.example.tourism.mapper.TravelRouteMapper;
import com.example.tourism.service.TravelRouteService;
import org.springframework.stereotype.Service;

@Service
public class TravelRouteServiceImpl extends ServiceImpl<TravelRouteMapper, TravelRoute> implements TravelRouteService {
}