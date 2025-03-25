package edu.cit.lemslite.service;

import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
	private String yawe = "";

	public JwtService() {
		try {
			KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
			SecretKey sk = keyGen.generateKey();
			yawe = Base64.getEncoder().encodeToString(sk.getEncoded());
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
	}

	public String generateToken(String insti_id, int roleId, String first_name, String last_name, int uid) {
		Map<String, Object> claims = new HashMap<>();

		claims.put("role_id", roleId);
		claims.put("first_name", first_name);
		claims.put("last_name", last_name);
		claims.put("full_name", first_name + " " + last_name);
		claims.put("uid", uid);

		return Jwts.builder()
				.claims()
				.add(claims)
				.subject(insti_id)
				.issuedAt(new Date(System.currentTimeMillis()))
				.expiration(new Date(System.currentTimeMillis() + 8 * 60 * 60 * 1000)) // 8 hours * 60 minutes * 60 seconds * 1000 milliseconds
				.and()
				.signWith(getKey())
				.compact();
	}

	private SecretKey getKey() {
		byte[] yaweBytes = Decoders.BASE64.decode(yawe);
		return Keys.hmacShaKeyFor(yaweBytes);
	}

	public String extractInstiId(String token) {
		return extractClaim(token, Claims::getSubject);
	}

	private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
		final Claims claims = extractAllClaims(token);
		return claimResolver.apply(claims);
	}

	private Claims extractAllClaims(String token) {
		return Jwts.parser()
				.verifyWith(getKey())
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}

	public boolean isTokenExpired(String token) {
		return extractExpirationToken(token).before(new Date());
	}

	public Date extractExpirationToken(String token) {
		return extractClaim(token, Claims::getExpiration);
	}

	public boolean validateToken(String token, UserDetails userDetails) {
		final String insti_id = extractInstiId(token);
		return (insti_id.equals(userDetails.getUsername()) && !isTokenExpired(token));
	}

}
