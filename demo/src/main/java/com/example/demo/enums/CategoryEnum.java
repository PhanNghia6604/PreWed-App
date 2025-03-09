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
    TONGIAO("Tôn giáo");

    private final String categoryName;

    // Constructor
    CategoryEnum(String categoryName) {
        this.categoryName = categoryName;
    }

    // Getter
    public String getCategoryName() {
        return categoryName;
    }

    // To String method for easier logging/debugging
    @Override
    public String toString() {
        return categoryName;
    }

    // Static method to get CategoryEnum by category name
    public static CategoryEnum fromCategoryName(String categoryName) {
        for (CategoryEnum category : values()) {
            if (category.categoryName.equalsIgnoreCase(categoryName)) {
                return category;
            }
        }
        throw new IllegalArgumentException("No enum constant for category: " + categoryName);
    }
}

