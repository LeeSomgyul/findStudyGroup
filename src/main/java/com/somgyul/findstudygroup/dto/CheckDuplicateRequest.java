package com.somgyul.findstudygroup.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CheckDuplicateRequest {
    private String field;
    private String value;
}