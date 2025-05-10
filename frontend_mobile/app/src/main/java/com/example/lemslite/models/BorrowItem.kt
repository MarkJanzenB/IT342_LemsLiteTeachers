package com.example.lemslite.models

import java.util.Date

data class BorrowItem (
    val borrowedId: Int,
    val userId: Int,
    val itemName: String,
    val categoryName: String,
    val quantity: Int,
    val status: String,
    val borrowedDate: Date
)