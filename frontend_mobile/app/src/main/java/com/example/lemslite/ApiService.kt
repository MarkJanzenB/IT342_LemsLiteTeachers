import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.Call

interface ApiService {
    @POST("/user/login")
    fun login(@Body loginDetails: Map<String, String>): Call<String>
}