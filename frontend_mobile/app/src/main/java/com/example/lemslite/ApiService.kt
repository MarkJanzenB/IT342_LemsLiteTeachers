import com.example.lemslite.BorrowItem
import com.google.gson.JsonObject
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.Call
import retrofit2.http.GET
import retrofit2.http.Path

interface ApiService {
    @POST("/user/login")
    fun login(@Body loginDetails: JsonObject): Call<String>

    @POST("/user/register")
    fun register(@Body userDetails: JsonObject): Call<Void>

    @GET("/api/borrowitem/uid/{uid}")
    fun getBorrowItemsByUid(@Path("uid") uid: String): Call<List<BorrowItem>>

}