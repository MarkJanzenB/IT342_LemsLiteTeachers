package com.example.lemslite.services

import android.util.Base64
import android.util.Log
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import java.util.Date
import javax.crypto.SecretKey

class JwtService {

    private val secretKey: SecretKey = Keys.hmacShaKeyFor(
        Base64.decode("TEVNUy1MSVRFU1lTSU5URUcyMDI1MjYyNjI2MjYyNjI2MjY=", Base64.DEFAULT)
    )

    fun isTokenExpired(token: String): Boolean {
        return try {
            val claims = extractAllClaims(token)
            val expiration = claims.expiration
            expiration.before(Date())
        } catch (e: Exception) {
            Log.e("com.example.lemslite.services.JwtService", "Error validating token: ${e.message}", e)
            true
        }
    }

    private fun extractAllClaims(token: String): Claims {
        return Jwts.parserBuilder()
            .setSigningKey(secretKey)
            .build()
            .parseClaimsJws(token)
            .body
    }

    fun getSubFromToken(token: String): String? {
        return try {
            val claims = extractAllClaims(token)
            claims["sub"] as? String
        } catch (e: Exception) {
            Log.e("com.example.lemslite.services.JwtService", "Error extracting subject: ${e.message}", e)
            null
        }
    }

    fun getFNameFromToken(token: String): String? {
        return try {
            val claims = extractAllClaims(token)
            claims["first_name"] as? String
        } catch (e: Exception) {
            Log.e("com.example.lemslite.services.JwtService", "Error extracting first_name: ${e.message}", e)
            null
        }
    }

    fun getLNameFromToken(token: String): String? {
        return try {
            val claims = extractAllClaims(token)
            claims["last_name"] as? String
        } catch (e: Exception) {
            Log.e("com.example.lemslite.services.JwtService", "Error extracting last_name: ${e.message}", e)
            null
        }
    }

    fun getFullNameFromToken(token: String): String? {
        return try {
            val claims = extractAllClaims(token)
            claims["full_name"] as? String
        } catch (e: Exception) {
            Log.e("com.example.lemslite.services.JwtService", "Error extracting full_name: ${e.message}", e)
            null
        }
    }

    fun getRoleIdFromToken(token: String): Int? {
        return try {
            val claims = extractAllClaims(token)
            claims["role_id"]?.toString()?.toIntOrNull()
        } catch (e: Exception) {
            Log.e("JwtService", "Error extracting role_id: ${e.message}", e)
            null
        }
    }

    fun getUidFromToken(token: String): Integer? {
        return try {
            val claims = extractAllClaims(token)
            val uid = claims["uid"] as? Integer
            Log.d("JwtService", "Extracted UID: $uid")
            uid
        } catch (e: Exception) {
            Log.e("JwtService", "Error extracting uid: ${e.message}", e)
            null
        }
    }
}