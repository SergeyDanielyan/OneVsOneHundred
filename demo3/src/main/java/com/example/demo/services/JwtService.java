package com.example.demo.services;

import com.example.demo.models.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Objects;

@Service
public class JwtService {
    private String secretKey = "my0320character0ultra0secure0and0ultra0long0secret";

    public Claims extractAllClaims(String token) {
        return Jwts.parser().verifyWith(signingKey())
                .build().parseSignedClaims(token).getPayload();
    }
    public Boolean isValid(String token, UserDetails user) {
        return Objects.equals(extractAllClaims(token).getSubject(), user.getUsername()) && !extractAllClaims(token).getExpiration().before(new Date());
    }

    public String generateToken(User user)  {

        return Jwts.builder().subject(user.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000))
                .signWith(signingKey())
                .compact();
    }
    private SecretKey signingKey()  {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}