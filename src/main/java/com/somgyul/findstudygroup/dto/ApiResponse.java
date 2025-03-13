package com.somgyul.findstudygroup.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApiResponse<T> {
    private String status;
    private T data;
    private String message;

    //✅성공시 응답
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .status("success")
                .data(data)
                .message(null)
                .build();
    }

    //✅실패시 응답
    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .status("error")
                .data(null)
                .message(message)
                .build();
    }
}
