import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import javax.crypto.SecretKey
import java.util.Date

class JwtService {
    private val secretKey: SecretKey = Keys.hmacShaKeyFor(ByteArray(32) { it.toByte() })

    fun isTokenExpired(token: String): Boolean {
        val claims = extractAllClaims(token)
        val expiration = claims.expiration
        return expiration.before(Date())
    }

    fun extractAllClaims(token: String): Claims {
        return Jwts.parserBuilder()
            .setSigningKey(secretKey)
            .build()
            .parseClaimsJws(token)
            .body
    }
}