package com.example.lemslite.services

import com.example.lemslite.models.BorrowItem
import com.example.lemslite.models.Item
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
    fun login(@Body loginDetails: JsonObject
    ): Call<String>

    @POST("/user/register")
    fun register(@Body userDetails: JsonObject
    ): Call<Void>

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

    @PUT("/user/updateEmail")
    fun updateEmail(
        @Query("uid") uid: Integer,
        @Query("newEmail") newEmail: String
    ): Call<Void>

    @PUT("/user/changePassword")
    fun changePassword(
        @Query("uid") uid: Integer,
        @Query("oldPassword") oldPassword: String,
        @Query("newPassword") newPassword: String
    ): Call<Void>

    @PUT("/user/editpfp")
    fun editPfp(
        @Body newPfpDetails: JsonObject
    ): Call<Void>

    @PUT("/user/removePfp")
    fun removePfp(
        @Query("uid") uid: Int
    ): Call<Void>

    @GET("/inventory/getAllInventory")
    fun getAllItems(
    ): Call<List<Item>>

    @GET("/api/preparing-items/getpreparingitems")
    fun getBorrowings(
        @Query("uid") uid: String,
        @Query("status") status: String
    ): Call<List<BorrowItem>>
    
}