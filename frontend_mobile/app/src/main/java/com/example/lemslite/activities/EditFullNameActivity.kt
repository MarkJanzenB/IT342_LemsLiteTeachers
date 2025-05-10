package com.example.lemslite.activities

import android.content.SharedPreferences
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.lemslite.databinding.ActivityEditFullNameBinding
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import android.text.Editable
import android.text.TextWatcher
import com.example.lemslite.services.ApiService
import com.example.lemslite.services.JwtService
import com.example.lemslite.instances.RetrofitInstance
import com.example.lemslite.models.UserDetailsResponse
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import kotlin.apply

class EditFullNameActivity : AppCompatActivity() {
    private lateinit var binding: ActivityEditFullNameBinding
    private var originalFirstName: String? = null
    private var originalLastName: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityEditFullNameBinding.inflate(layoutInflater)
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

        binding.saveChangesButton.isEnabled = false

        val textWatcher = object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                val newFirstName = binding.firstNameEditText.text.toString().trim()
                val newLastName = binding.lastNameEditText.text.toString().trim()
                binding.saveChangesButton.isEnabled =
                    newFirstName != originalFirstName || newLastName != originalLastName
            }
            override fun afterTextChanged(s: Editable?) {}
        }

        binding.firstNameEditText.addTextChangedListener(textWatcher)
        binding.lastNameEditText.addTextChangedListener(textWatcher)

        binding.saveChangesButton.setOnClickListener {
            val newFirstName = binding.firstNameEditText.text.toString().trim()
            val newLastName = binding.lastNameEditText.text.toString().trim()
            if (newFirstName != originalFirstName || newLastName != originalLastName) {
                MaterialAlertDialogBuilder(this)
                    .setTitle("Confirm Changes?")
                    .setNegativeButton("CANCEL") { dialog, _ -> dialog.dismiss() }
                    .setPositiveButton("CONFIRM") { _, _ ->
                        if (token != null) {
                            val jwtService = JwtService()
                            val uid = jwtService.getUidFromToken(token)
                            if (uid != null) {
                                updateName(uid, newFirstName, newLastName, sharedPreferences)
                            }
                        }
                    }
                    .show()
            } else {
                Toast.makeText(this, "No changes detected.", Toast.LENGTH_SHORT).show()
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
                        originalFirstName = userDetails.first_name
                        originalLastName = userDetails.last_name
                        binding.firstNameEditText.setText(originalFirstName)
                        binding.lastNameEditText.setText(originalLastName)
                    }
                } else {
                    Toast.makeText(this@EditFullNameActivity, "Failed to fetch user details.", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<UserDetailsResponse>, t: Throwable) {
                Toast.makeText(this@EditFullNameActivity, "Network error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun updateName(uid: Integer, newFirstName: String?, newLastName: String?, sharedPreferences: SharedPreferences) {
        val apiService = RetrofitInstance.getRetrofit(this).create(ApiService::class.java)

        apiService.updateName(uid, newFirstName, newLastName).enqueue(object : Callback<Void> {
            override fun onResponse(call: Call<Void>, response: Response<Void>) {
                if (response.isSuccessful) {
                    sharedPreferences.edit().apply {
                        putString("first_name", newFirstName)
                        putString("last_name", newLastName)
                        apply()
                    }
                    originalFirstName = newFirstName
                    originalLastName = newLastName
                    Toast.makeText(this@EditFullNameActivity, "Name updated successfully", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(this@EditFullNameActivity, "Failed to update name.", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<Void>, t: Throwable) {
                Toast.makeText(this@EditFullNameActivity, "Network error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }
}