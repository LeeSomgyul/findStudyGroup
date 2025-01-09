package com.somgyul.findstudygroup.controller;

import com.somgyul.findstudygroup.dto.CheckDuplicateRequest;
import com.somgyul.findstudygroup.service.CheckDuplicateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/api")
public class CheckDuplicateController {

    @Autowired
    private CheckDuplicateService checkDuplicateService;

    @PostMapping("/check-duplicate")
    public Map<String, Object> CheckDuplicate(@RequestBody CheckDuplicateRequest request) {
        boolean exists = checkDuplicateService.isDuplicate(request.getField(), request.getValue());

        Map<String, Object> response = new HashMap<>();
        response.put("exists", exists);
        return response;
    }
}
