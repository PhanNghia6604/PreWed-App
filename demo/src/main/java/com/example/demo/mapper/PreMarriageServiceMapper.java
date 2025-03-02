package com.example.demo.mapper;

import com.example.demo.entity.ServicePackage;
import com.example.demo.entity.request.ServicePackageRequest;
import org.modelmapper.PropertyMap;

public class PreMarriageServiceMapper extends PropertyMap<ServicePackageRequest, ServicePackage> {
    @Override
    protected void configure() {
        map().setId(0);
    }
}
