package com.example.lemslite

import com.example.lemslite.models.UserDetailsResponse
import com.google.gson.JsonObject
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.Call
import retrofit2.http.GET
import retrofit2.http.PUT
import retrofit2.http.Query

interface ApiService {
    @POST("/user/login")
    fun login(@Body loginDetails: JsonObject): Call<String>

    @POST("/user/register")
    fun register(@Body userDetails: JsonObject): Call<Void>

    @PUT("/user/updateName")
    fun updateName(
        @Query("uid") uid: Integer,
        @Query("newFirstName") newFirstName: String?,
        @Query("newLastName") newLastName: String?
    ): Call<Void>

    @GET("/user/getuser")
    fun getUserDetails(
        @Query("uid") uid: Integer
    ): Call<UserDetailsResponse>
}