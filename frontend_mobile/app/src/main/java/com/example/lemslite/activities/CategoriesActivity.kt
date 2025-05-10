package com.example.lemslite.activities

import android.content.Intent
import android.os.Bundle
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.bumptech.glide.Glide
import com.example.lemslite.R
import com.example.lemslite.instances.RetrofitInstance
import com.example.lemslite.models.UserDetailsResponse
import com.example.lemslite.services.ApiService
import com.example.lemslite.services.JwtService
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class CategoriesActivity : AppCompatActivity() {
    private val sharedPreferences by lazy {
        getSharedPreferences("user_session", MODE_PRIVATE)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_categories)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val userIcon = findViewById<ImageView>(R.id.userIcon)
        val token = sharedPreferences.getString("jwt_token", null)
        if (token != null) {
            val jwtService = JwtService()
            val uid = jwtService.getUidFromToken(token)
            if (uid != null) {
                fetchUserDetails(uid, userIcon)
            } else {
                Toast.makeText(this, "Invalid user ID. Please log in again.", Toast.LENGTH_SHORT).show()
            }
        }

        userIcon.setOnClickListener {
            val intent = Intent(this, AccountActivity::class.java)
            startActivity(intent)
        }

        val backIcon = findViewById<ImageView>(R.id.backIcon)
        backIcon.setOnClickListener {
            onBackPressedDispatcher.onBackPressed()
        }

        findViewById<LinearLayout>(R.id.homeNavButton).setOnClickListener {
            startActivity(Intent(this, HomeActivity::class.java))
        }

        findViewById<LinearLayout>(R.id.scheduleNavButton).setOnClickListener {
            startActivity(Intent(this, ScheduleActivity::class.java))
        }

        findViewById<LinearLayout>(R.id.reportsNavButton).setOnClickListener {
            startActivity(Intent(this, ReportsActivity::class.java))
        }

        findViewById<LinearLayout>(R.id.historyNavButton).setOnClickListener {
            startActivity(Intent(this, BorrowHistoryActivity::class.java))
        }
    }

    private fun fetchUserDetails(uid: Integer, userIcon: ImageView) {
        val apiService = RetrofitInstance.getRetrofit(this).create(ApiService::class.java)
        apiService.getUserDetails(uid).enqueue(object : Callback<UserDetailsResponse> {
            override fun onResponse(call: Call<UserDetailsResponse>, response: Response<UserDetailsResponse>) {
                if (response.isSuccessful) {
                    val userDetails = response.body()
                    if (userDetails != null) {
                        val profilePictureUrl = userDetails.pfp
                        if (!profilePictureUrl.isNullOrEmpty()) {
                            Glide.with(this@CategoriesActivity)
                                .load(profilePictureUrl)
                                .into(userIcon)
                        }
                    }
                } else {
                    Toast.makeText(this@CategoriesActivity, "Failed to fetch user details.", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<UserDetailsResponse>, t: Throwable) {
                Toast.makeText(this@CategoriesActivity, "Network error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }

    override fun onResume() {
        super.onResume()
        val token = sharedPreferences.getString("jwt_token", null)
        if (token != null) {
            val jwtService = JwtService()
            val uid = jwtService.getUidFromToken(token)
            if (uid != null) {
                val userIcon = findViewById<ImageView>(R.id.userIcon)
                fetchUserDetails(uid, userIcon)
            } else {
                Toast.makeText(this, "Invalid user ID. Please log in again.", Toast.LENGTH_SHORT).show()
            }
        }
    }
}