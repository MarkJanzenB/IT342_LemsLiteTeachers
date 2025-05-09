package com.example.lemslite.activities

import android.content.SharedPreferences
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.lemslite.databinding.ActivityEditEmailBinding
import com.example.lemslite.instances.RetrofitInstance
import com.example.lemslite.models.UserDetailsResponse
import com.example.lemslite.services.ApiService
import com.example.lemslite.services.JwtService
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class EditEmailActivity : AppCompatActivity() {
    private lateinit var binding: ActivityEditEmailBinding
    private var originalEmail: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityEditEmailBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val sharedPreferences = getSharedPreferences("user_session", MODE_PRIVATE)
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

        binding.saveChangesButton.setOnClickListener {
            val newEmail = binding.emailEditText.text.toString().trim()
            if (newEmail.isNotEmpty() && newEmail != originalEmail) {
                MaterialAlertDialogBuilder(this)
                    .setTitle("Confirm Changes?")
                    .setNegativeButton("CANCEL") { dialog, _ -> dialog.dismiss() }
                    .setPositiveButton("CONFIRM") { _, _ ->
                        if (token != null) {
                            val jwtService = JwtService()
                            val uid = jwtService.getUidFromToken(token)
                            if (uid != null) {
                                updateEmail(uid, newEmail, sharedPreferences)
                            }
                        }
                    }
                    .show()
            } else {
                Toast.makeText(this, "No changes detected or email is empty.", Toast.LENGTH_SHORT).show()
            }
        }

        binding.backIcon.setOnClickListener {
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
                        originalEmail = userDetails.email
                        binding.emailEditText.setText(originalEmail)
                    }
                } else {
                    Toast.makeText(this@EditEmailActivity, "Failed to fetch user details.", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<UserDetailsResponse>, t: Throwable) {
                Toast.makeText(this@EditEmailActivity, "Network error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun updateEmail(uid: Integer, newEmail: String, sharedPreferences: SharedPreferences) {
        val apiService = RetrofitInstance.getRetrofit(this).create(ApiService::class.java)
        apiService.updateEmail(uid, newEmail).enqueue(object : Callback<Void> {
            override fun onResponse(call: Call<Void>, response: Response<Void>) {
                if (response.isSuccessful) {
                    sharedPreferences.edit().apply {
                        putString("email", newEmail)
                        apply()
                    }
                    originalEmail = newEmail
                    Toast.makeText(this@EditEmailActivity, "Email updated successfully", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(this@EditEmailActivity, "Failed to update email.", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<Void>, t: Throwable) {
                Toast.makeText(this@EditEmailActivity, "Network error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }
}