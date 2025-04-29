package com.example.lemslite

import ApiService
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.edit
import com.example.lemslite.databinding.ActivityLoginBinding
import com.google.gson.JsonObject
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class LoginActivity : AppCompatActivity() {
    private lateinit var binding: ActivityLoginBinding
    private val sharedPreferences by lazy {
        getSharedPreferences("user_session", MODE_PRIVATE)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val token = sharedPreferences.getString("jwt_token", null)
        if (token != null && !isTokenExpired(token)) {
            navigateToLoginSuccess()
            return
        }

        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnLogin.setOnClickListener {
            val instiId = binding.idNumberInputTextLayout.editText?.text.toString().trim()
            val password = binding.passwordInputTextLayout.editText?.text.toString().trim()

            if (instiId.isNotEmpty() && password.isNotEmpty()) {
                loginUser(instiId, password)
            } else {
                Toast.makeText(this, "Please fill in all fields", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun loginUser(instiId: String, password: String) {
        val apiService = RetrofitInstance.retrofit.create(ApiService::class.java)

        val loginDetails = JsonObject().apply {
            addProperty("insti_id", instiId)
            addProperty("password", password)
        }

        val call = apiService.login(loginDetails)
        call.enqueue(object : Callback<String> {
            override fun onResponse(call: Call<String>, response: Response<String>) {
                if (response.isSuccessful) {
                    val token = response.body()
                    if (token != null && token != "User doesn't exists" && token != "Incorrect Password") {
                        handleToken(token)
                    } else {
                        val errorMessage = token ?: "An unexpected error occurred."
                        Toast.makeText(this@LoginActivity, errorMessage, Toast.LENGTH_SHORT).show()
                    }
                } else {
                    val errorMessage = response.errorBody()?.string() ?: "An unexpected error occurred."
                    Log.e("LoginActivity", "Login failed: $errorMessage")
                    Toast.makeText(this@LoginActivity, errorMessage, Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<String>, t: Throwable) {
                Log.e("LoginActivity", "Network error: ${t.message}", t)
                Toast.makeText(this@LoginActivity, "Unable to connect. Please check your internet connection.", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun handleToken(token: String) {
        try {
            val jwtService = JwtService()
            val roleId = jwtService.getRoleIdFromToken(token)

            if (roleId == 1) {
                saveToken(token)
                Toast.makeText(this, "Welcome! Login successful.", Toast.LENGTH_SHORT).show()
                navigateToLoginSuccess()
            } else {
                Toast.makeText(this, "Only teachers can log in to this application.", Toast.LENGTH_SHORT).show()
            }
        } catch (e: Exception) {
            Log.e("LoginActivity", "Error processing token: ${e.message}", e)
            Toast.makeText(this, "Invalid token received. Please contact support.", Toast.LENGTH_SHORT).show()
        }
    }

    private fun saveToken(token: String) {
        sharedPreferences.edit { putString("jwt_token", token) }
    }

    private fun isTokenExpired(token: String): Boolean {
        val jwtService = JwtService()
        return jwtService.isTokenExpired(token)
    }

    private fun navigateToLoginSuccess() {
        if (!isFinishing) {
            Log.d("LoginActivity", "Navigating to LoginSuccessActivity")
            val intent = Intent(this, LoginSuccessActivity::class.java)
            startActivity(intent)
            finish()
        } else {
            Log.w("LoginActivity", "Activity is finishing, cannot navigate")
        }
    }
}