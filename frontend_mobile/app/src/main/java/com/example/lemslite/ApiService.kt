package com.example.lemslite

import com.google.gson.JsonObject
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.Call

interface ApiService {
    @POST("/user/login")
    fun login(@Body loginDetails: JsonObject): Call<String>

    @POST("/user/register")
    fun register(@Body userDetails: JsonObject): Call<Void>
}