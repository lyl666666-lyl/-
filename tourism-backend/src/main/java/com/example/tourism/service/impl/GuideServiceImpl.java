package com.example.tourism.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.tourism.entity.Guide;
import com.example.tourism.mapper.GuideMapper;
import com.example.tourism.service.GuideService;
import org.springframework.stereotype.Service;

@Service
public class GuideServiceImpl extends ServiceImpl<GuideMapper, Guide> implements GuideService {
}