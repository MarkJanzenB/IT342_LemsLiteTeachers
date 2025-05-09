package com.example.lemslite.activities

import android.content.Intent
import android.os.Bundle
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.core.content.edit
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.bumptech.glide.Glide
import com.example.lemslite.R
import com.example.lemslite.instances.RetrofitInstance
import com.example.lemslite.models.UserDetailsResponse
import com.example.lemslite.services.ApiService
import com.example.lemslite.services.JwtService
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class AccountActivity : AppCompatActivity() {
    private val sharedPreferences by lazy {
        getSharedPreferences("user_session", MODE_PRIVATE)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_account)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val token = sharedPreferences.getString("jwt_token", null)
        if (token != null) {
            val jwtService = JwtService()
            val uid = jwtService.getUidFromToken(token)
            if (uid != null) {
                fetchUserDetails(uid)
            } else {
                Toast.makeText(this, "Invalid user ID. Please log in again.", Toast.LENGTH_SHORT).show()
            }
        }

        val logoutContainer = findViewById<ConstraintLayout>(R.id.logoutContainer)
        logoutContainer.setOnClickListener {
            showLogoutDialog()
        }

        val accountSettingsContainer = findViewById<ConstraintLayout>(R.id.accountSettingsContainer)
        accountSettingsContainer.setOnClickListener {
            val intent = Intent(this, AccountSettingsActivity::class.java)
            startActivity(intent)
        }

        val backIcon = findViewById<ImageView>(R.id.backIcon)
        backIcon.setOnClickListener {
            finish()
        }
    }

    private fun fetchUserDetails(uid: Integer) {
        val apiService = RetrofitInstance.getRetrofit(this).create(ApiService::class.java)
        apiService.getUserDetails(uid).enqueue(object : Callback<UserDetailsResponse> {
            override fun onResponse(call: Call<UserDetailsResponse>, response: Response<UserDetailsResponse>) {
                if (response.isSuccessful) {
                    val userDetails = response.body()
                    if (userDetails != null) {
                        findViewById<TextView>(R.id.userId).text = userDetails.insti_id
                        findViewById<TextView>(R.id.userName).text = "${userDetails.first_name} ${userDetails.last_name}"

                        val profilePictureUrl = userDetails.pfp
                        if (!profilePictureUrl.isNullOrEmpty()) {
                            val profilePicture = findViewById<ImageView>(R.id.profilePicture)
                            Glide.with(this@AccountActivity)
                                .load(profilePictureUrl)
                                .into(profilePicture)
                        }
                    }
                } else {
                    Toast.makeText(this@AccountActivity, "Failed to fetch user details.", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<UserDetailsResponse>, t: Throwable) {
                Toast.makeText(this@AccountActivity, "Network error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun showLogoutDialog() {
        MaterialAlertDialogBuilder(this)
            .setTitle("Confirm Sign Out?")
            .setPositiveButton("CONFIRM") { _, _ ->
                performLogout()
            }
            .setNegativeButton("CANCEL") { dialog, _ ->
                dialog.dismiss()
            }
            .setCancelable(false)
            .show()
    }

    private fun performLogout() {
        sharedPreferences.edit { clear() }

        val intent = Intent(this, LandingPageActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
    }
}