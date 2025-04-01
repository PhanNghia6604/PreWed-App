package com.example.demo.config;


import com.example.demo.security.jwt.JwtConfigurer;
import com.example.demo.security.SecurityProblemSupport;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.security.web.servlet.util.matcher.MvcRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfig {

    private final JwtConfigurer jwtConfigurer;

    private final SecurityProblemSupport problemSupport;

    /**
     * Public api list (no authentication)
     */
    public static final List<String> PUBLIC_APIS = List.of(
            "/api/login",
            "/api/logingoogle",
            "/api/get",
            "/api/register",
            "/api/{id}",
            "/api/expert/**",
            "/v3/api-docs/**",
            "/swagger-ui/index.html",
            "/swagger-ui/**",
            "/swagger-ui/swagger-ui-bundle.js",
            "/swagger-ui/swagger-initializer.js",
            "/swagger-ui/swagger-ui-standalone-preset.js",
            "/swagger-ui/index.css",
            "/webjars/**",
            "/favicon.ico",
            "/swagger-resources/**",
            "/api-docs/swagger-config",
            "/swagger-ui/favicon-32x32.png",
            "/swagger-ui/favicon-16x16.png",
            "/api-docs/**",
            "/api-docs",
            "/swagger-ui/swagger-ui.css",
            "/api/blogs",
            "/api/blogs/{id}"

    );

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, MvcRequestMatcher.Builder mvc) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .httpBasic(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(
                        auth ->
                                auth.requestMatchers(apiPublic(mvc)).permitAll()
                                        .anyRequest().authenticated()
                )
                .exceptionHandling(
                        httpSecurityExceptionHandlingConfigurer ->
                                httpSecurityExceptionHandlingConfigurer
                                        .accessDeniedHandler(problemSupport)
                                        .authenticationEntryPoint(problemSupport)
                )
                .headers(
                        httpSecurityHeadersConfigurer ->
                                httpSecurityHeadersConfigurer
                                        .referrerPolicy(
                                                referrerPolicyConfig ->
                                                        referrerPolicyConfig.policy(
                                                                ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN
                                                        )
                                        )
                                        .frameOptions(HeadersConfigurer.FrameOptionsConfig::disable)
                                        .httpStrictTransportSecurity(HeadersConfigurer.HstsConfig::disable)
                )
                .apply(jwtConfigurer);

        return http.build();
    }

    public RequestMatcher[] apiPublic(MvcRequestMatcher.Builder mvc) {
        return PUBLIC_APIS.stream()
                .map(mvc::pattern)
                .toArray(RequestMatcher[]::new);
    }

    @Bean
    MvcRequestMatcher.Builder mvc(HandlerMappingIntrospector introspector) {
        return new MvcRequestMatcher.Builder(introspector);
    }

}