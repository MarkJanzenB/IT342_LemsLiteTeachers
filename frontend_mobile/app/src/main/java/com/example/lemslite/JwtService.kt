import android.util.Base64
import android.util.Log
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import java.util.Date
import javax.crypto.SecretKey

class JwtService {

    // Decode the Base64-encoded secret key
    private val secretKey: SecretKey = Keys.hmacShaKeyFor(
        Base64.decode("TEVNUy1MSVRFU1lTSU5URUcyMDI1MjYyNjI2MjYyNjI2MjY=", Base64.DEFAULT)
    )

    fun isTokenExpired(token: String): Boolean {
        return try {
            val claims = extractAllClaims(token)
            val expiration = claims.expiration
            expiration.before(Date())
        } catch (e: Exception) {
            Log.e("JwtService", "Error validating token: ${e.message}", e)
            true
        }
    }

    fun extractAllClaims(token: String): Claims {
        return Jwts.parserBuilder()
            .setSigningKey(secretKey)
            .build()
            .parseClaimsJws(token)
            .body
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
}