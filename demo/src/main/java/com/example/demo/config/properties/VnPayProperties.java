package com.example.demo.config.properties;

import com.example.demo.integration.vnpay.VnPayUtils;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;

@Data
@ConfigurationProperties(
        prefix = "integration.vnpay",
        ignoreUnknownFields = false
)
public class VnPayProperties {

    private String url;
    private String returnUrl;
    private String tmnCode ;
    private String secretKey;
    private String version;
    private String command;

    public Map<String, String> getVNPayConfig() {
        Map<String, String> vnpParamsMap = new HashMap<>();
        vnpParamsMap.put("vnp_Version", this.version);
        vnpParamsMap.put("vnp_Command", this.command);
        vnpParamsMap.put("vnp_TmnCode", this.tmnCode);
        vnpParamsMap.put("vnp_CurrCode", "VND");
        vnpParamsMap.put("vnp_TxnRef",  VnPayUtils.getRandomNumber(8));
        vnpParamsMap.put("vnp_OrderType", "Clothing");
        vnpParamsMap.put("vnp_Locale", "vn");
        vnpParamsMap.put("vnp_ReturnUrl", this.returnUrl);
        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnpCreateDate = formatter.format(calendar.getTime());
        vnpParamsMap.put("vnp_CreateDate", vnpCreateDate);
        calendar.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(calendar.getTime());
        vnpParamsMap.put("vnp_ExpireDate", vnp_ExpireDate);
        return vnpParamsMap;
    }
}
