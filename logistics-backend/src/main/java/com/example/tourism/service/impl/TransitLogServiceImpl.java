package com.example.tourism.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.tourism.entity.TransitLog;
import com.example.tourism.mapper.TransitLogMapper;
import com.example.tourism.service.TransitLogService;
import org.springframework.stereotype.Service;

@Service
public class TransitLogServiceImpl extends ServiceImpl<TransitLogMapper, TransitLog> implements TransitLogService {
}
