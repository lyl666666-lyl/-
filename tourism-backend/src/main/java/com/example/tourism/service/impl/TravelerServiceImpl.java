package com.example.tourism.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.tourism.entity.Traveler;
import com.example.tourism.mapper.TravelerMapper;
import com.example.tourism.service.TravelerService;
import org.springframework.stereotype.Service;

@Service
public class TravelerServiceImpl extends ServiceImpl<TravelerMapper, Traveler> implements TravelerService {
}