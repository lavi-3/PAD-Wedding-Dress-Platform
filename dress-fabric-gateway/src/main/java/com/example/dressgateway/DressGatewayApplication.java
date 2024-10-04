package com.example.dressgateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class DressGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(DressGatewayApplication.class, args);
    }
}
