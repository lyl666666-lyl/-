package com.example.tourism.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.tourism.entity.TravelArrangement;
import com.example.tourism.mapper.TravelArrangementMapper;
import com.example.tourism.service.TravelArrangementService;
import org.springframework.stereotype.Service;

@Service
public class TravelArrangementServiceImpl extends ServiceImpl<TravelArrangementMapper, TravelArrangement> implements TravelArrangementService {
}