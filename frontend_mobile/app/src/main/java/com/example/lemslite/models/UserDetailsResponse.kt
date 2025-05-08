package com.example.lemslite.models

data class UserDetailsResponse(
    val email: String,
    val pfp: String,
    val role: Role,
    val insti_id: String,
    val is_new: Boolean,
    val user_id: Int,
    val last_name: String,
    val first_name: String
)

data class Role(
    val role_id: Int,
    val role_name: String
)