package com.example.tourism.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.tourism.entity.TourPackage;
import com.example.tourism.mapper.TourPackageMapper;
import com.example.tourism.service.TourPackageService;
import org.springframework.stereotype.Service;

@Service
public class TourPackageServiceImpl extends ServiceImpl<TourPackageMapper, TourPackage> implements TourPackageService {
}