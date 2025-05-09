package com.example.lemslite.activities

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.lemslite.databinding.ActivityChangePasswordBinding
import com.example.lemslite.instances.RetrofitInstance
import com.example.lemslite.services.ApiService
import com.example.lemslite.services.JwtService
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ChangePasswordActivity : AppCompatActivity() {
    private lateinit var binding: ActivityChangePasswordBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityChangePasswordBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val sharedPreferences = getSharedPreferences("user_session", MODE_PRIVATE)
        val token = sharedPreferences.getString("jwt_token", null)

        binding.saveChangesButton.setOnClickListener {
            val currentPassword = binding.currentPasswordEditText.text.toString().trim()
            val newPassword = binding.newPasswordEditText.text.toString().trim()
            val confirmNewPassword = binding.confirmNewPasswordEditText.text.toString().trim()

            if (currentPassword.isEmpty() || newPassword.isEmpty() || confirmNewPassword.isEmpty()) {
                Toast.makeText(this, "All fields are required", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (newPassword != confirmNewPassword) {
                Toast.makeText(this, "New passwords do not match", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            MaterialAlertDialogBuilder(this)
                .setTitle("Confirm Changes?")
                .setNegativeButton("CANCEL") { dialog, _ -> dialog.dismiss() }
                .setPositiveButton("CONFIRM") { _, _ ->
                    if (token != null) {
                        val jwtService = JwtService()
                        val uid = jwtService.getUidFromToken(token)
                        if (uid != null) {
                            changePassword(uid, currentPassword, newPassword)
                        }
                    }
                }
                .show()
        }

        binding.backIcon.setOnClickListener {
            finish()
        }
    }

    private fun changePassword(uid: Integer, oldPassword: String, newPassword: String) {
        val apiService = RetrofitInstance.getRetrofit(this).create(ApiService::class.java)
        apiService.changePassword(uid, oldPassword, newPassword).enqueue(object : Callback<Void> {
            override fun onResponse(call: Call<Void>, response: Response<Void>) {
                if (response.isSuccessful) {
                    Toast.makeText(this@ChangePasswordActivity, "Password changed successfully", Toast.LENGTH_SHORT).show()
                    finish()
                } else {
                    Toast.makeText(this@ChangePasswordActivity, "Failed to change password: ${response.message()}", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<Void>, t: Throwable) {
                Toast.makeText(this@ChangePasswordActivity, "Network error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }
}