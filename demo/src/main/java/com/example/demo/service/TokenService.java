package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

@Service
@Slf4j
public class TokenService {

    @Autowired
    UserRepository userRepository;

    static String AUTHORITIES_KEY = "auth";

    static String INVALID_JWT_TOKEN = "Invalid JWT token";

    SecretKey key;

    JwtParser jwtParser;

    private final String SECRET_KEY = "G2PaZgX9HcYPoyByu48NJpmmStYfdk1t0JZtGhlk5oY=";

    public TokenService() {

        byte[] keyBytes;
        keyBytes = Decoders.BASE64URL.decode(SECRET_KEY);
        key = Keys.hmacShaKeyFor(keyBytes);
        jwtParser = Jwts.parser().verifyWith(key).build();
    }

    private SecretKey getSigninKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // tao token
    public String generateToken(Authentication authentication) {
        String authorities = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.joining(","));

        Date validity = new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24);

        return Jwts
                .builder()
                .subject(authentication.getName())
                .claim(AUTHORITIES_KEY, authorities)
                .signWith(key)
                .expiration(validity)
                .compact();
    }

    public User getAccountByToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigninKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        String idString = claims.getSubject();
        long id = Long.parseLong(idString);

        User user = userRepository.findUserById(id);

        return user;

    }

    public boolean validateToken(String authToken) {
        try {
            jwtParser.parseSignedClaims(authToken);
            return true;
        } catch (Exception e) {
            log.trace(INVALID_JWT_TOKEN, e);
            throw new BadCredentialsException(INVALID_JWT_TOKEN);
        }
    }

    public Authentication getAuthentication(String token) {
        Claims claims = jwtParser.parseSignedClaims(token).getPayload();

        Collection<? extends GrantedAuthority> authorities = Arrays
                .stream(claims.get(AUTHORITIES_KEY).toString().split(","))
                .filter(auth -> !auth.trim().isEmpty())
                .map("ROLE_"::concat)
                .map(SimpleGrantedAuthority::new)
                .toList();

        org.springframework.security.core.userdetails.User principal = new org.springframework.security.core.userdetails.User(claims.getSubject(), "", authorities);

        return new UsernamePasswordAuthenticationToken(principal, token, authorities);
    }
}
