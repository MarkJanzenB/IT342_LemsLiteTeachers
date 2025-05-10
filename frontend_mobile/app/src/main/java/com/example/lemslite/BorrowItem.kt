package com.example.lemslite

import java.util.Date

data class BorrowItem (
    val borrowedId: Int,
    val user: Any,
    val itemName: String,
    val categoryName: String,
    val quantity: Int,
    val status: String,
    val borrowedDate: Date
)