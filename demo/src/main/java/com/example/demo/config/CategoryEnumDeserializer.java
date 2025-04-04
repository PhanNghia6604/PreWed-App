package com.example.demo.config;

import com.example.demo.enums.CategoryEnum;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;

public class CategoryEnumDeserializer extends JsonDeserializer<CategoryEnum> {

    @Override
    public CategoryEnum deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String categoryName = p.getText().trim();

        // Kiểm tra nếu chuỗi là "ALL", ta sẽ trả về "Tất cả chuyên môn"
        if ("ALL".equalsIgnoreCase(categoryName)) {
            return CategoryEnum.ALL;  // Trả về "ALL"
        }

        categoryName = categoryName.toUpperCase()
                .replace("TÂM LÝ", "TAMLY")
                .replace("TÀI CHÍNH", "TAICHINH")
                .replace("TÔN GIÁO", "TONGIAO")
                .replace("SỨC KHỎE", "SUCKHOE")
                .replace("GIAO TIẾP", "GIAOTIEP")
                .replace("GIA ĐÌNH", "GIADINH");

        try {
            return CategoryEnum.valueOf(categoryName);  // Trả về CategoryEnum từ tên chuỗi
        } catch (IllegalArgumentException e) {
            throw new IOException("Unknown category: " + categoryName);
        }
    }
}
