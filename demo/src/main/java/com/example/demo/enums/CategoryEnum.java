package com.example.demo.enums;

import com.example.demo.config.CategoryEnumDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

@JsonDeserialize(using = CategoryEnumDeserializer.class)
public enum CategoryEnum {
    TAMLY("Tâm lý"),
    TAICHINH("Tài chính"),
    GIADINH("Gia đình"),
    SUCKHOE("Sức khỏe"),
    GIAOTIEP("Giao tiếp"),
    TONGIAO("Tôn giáo"),
    ALL("Tất cả chuyên môn"); // This stays, but handled as a special case

    private final String categoryName;

    CategoryEnum(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getCategoryName() {
        return categoryName;
    }

    @Override
    public String toString() {
        return categoryName;
    }

    public static CategoryEnum fromCategoryName(String categoryName) {
        if ("ALL".equalsIgnoreCase(categoryName)) {
            return CategoryEnum.ALL;  // Trả về Enum ALL khi chọn tất cả
        }

        for (CategoryEnum category : values()) {
            if (category.categoryName.equalsIgnoreCase(categoryName)) {
                return category;
            }
        }
        throw new IllegalArgumentException("No enum constant for category: " + categoryName);
    }

    public String getDisplayName() {
        if (this == CategoryEnum.ALL) {
            return "Tất cả chuyên môn";
        }
        return categoryName;  // Trả về tên chuyên môn thông thường
    }
}
