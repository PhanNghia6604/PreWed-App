package com.example.demo.config;

import com.example.demo.entity.User;
import com.example.demo.exception.exceptions.AuthorizeException;
import com.example.demo.service.TokenService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.util.List;

@Component
public class Filter extends OncePerRequestFilter {

    @Autowired
    @Qualifier("handlerExceptionResolver")
    HandlerExceptionResolver resolver;

    @Autowired
    TokenService tokenService;

    List<String> PUBLIC_API = List.of(
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/swagger-resources/**",
            "/api/login",
            "/api/get",
            "/api/register"
    );

    boolean isPermitted(String uri){
        AntPathMatcher pathMatcher = new AntPathMatcher();
        return PUBLIC_API.stream().anyMatch(item -> pathMatcher.match(item, uri));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String uri = request.getRequestURI();
        if (isPermitted(uri)) {
            // Các API công khai
            filterChain.doFilter(request, response);
        } else {
            // API cần xác thực
            String token = getToken(request);

            if (token == null) {
                // Chưa đăng nhập => quăng lỗi
                resolver.resolveException(
                        request,
                        response,
                        null,
                        new AuthorizeException("Authentication token is missing")
                );
                return; // Dừng tại đây
            }

            User user = null;
            try {
                user = tokenService.getAccountByToken(token);
            } catch (MalformedJwtException e) {
                resolver.resolveException(
                        request,
                        response,
                        null,
                        new AuthorizeException("Authentication token is invalid")
                );
                return;
            } catch (ExpiredJwtException e) {
                resolver.resolveException(
                        request,
                        response,
                        null,
                        new AuthorizeException("Authentication token is expired")
                );
                return;
            } catch (Exception e) {
                resolver.resolveException(
                        request,
                        response,
                        null,
                        new AuthorizeException("Authentication token is invalid")
                );
                return;
            }

            // Kiểm tra user có null không
            if (user == null) {
                // Không tìm thấy user => Quăng lỗi
                resolver.resolveException(
                        request,
                        response,
                        null,
                        new AuthorizeException("User not found for token")
                );
                return;
            }

            // => user != null, token chuẩn => Tạo authentication
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            user,
                            token,
                            user.getAuthorities()  // Gọi an toàn vì user != null
                    );
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            // Đặt vào SecurityContext
            SecurityContextHolder.getContext().setAuthentication(authToken);
            filterChain.doFilter(request, response);
        }
    }

    String getToken(HttpServletRequest request){
        String header = request.getHeader("Authorization");
        if(header == null || !header.startsWith("Bearer ")) {
            return null;
        }
        return header.substring(7);
    }
}
