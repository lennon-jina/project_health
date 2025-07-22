package com.health.my.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Model model) {
        return "main/home";
    }
    
    // 당뇨병 예측 바로가기 추가
    @GetMapping("/diabetes")
    public String redirectToDiabetes() {
        return "redirect:/diabetes/predict";
    }
    
    @GetMapping("/nutrition")
    public String nutritionPage() {
        return "food/foodSearch"; 
    }
    
    @GetMapping("/about")
    public String about() {
        return "about/about"; 
    }
    
    // 효능 test 페이지
    @GetMapping("/effect")
    public String hu() {
        return "effect/effect";  
    }
    
    @GetMapping("/disease")
    public String disease() {
        return "info/disease";  
    }
    
    @GetMapping("/healthInfo")
    public String healthInfo() {
        return "info/healthInfo";  
    }
    
    @GetMapping("/weather")
    public String weather() {
        return "weather/weather";  
    }
    
    @GetMapping("/map")
    public String map() {
        return "map/map";  
    }
}