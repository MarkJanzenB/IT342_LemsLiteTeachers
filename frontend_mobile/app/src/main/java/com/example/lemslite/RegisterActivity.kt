package com.example.lemslite

import ApiService
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.lemslite.databinding.ActivityRegisterBinding
import com.google.gson.JsonObject
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class RegisterActivity : AppCompatActivity() {
    private lateinit var binding: ActivityRegisterBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnRegister.setOnClickListener {
            val firstName = binding.firstNameInputTextLayout.editText?.text.toString().trim()
            val lastName = binding.lastNameInputTextLayout.editText?.text.toString().trim()
            val instiId = binding.idNumberInputTextLayout.editText?.text.toString().trim()
            val email = binding.emailInputTextLayout.editText?.text.toString().trim()
            val password = binding.passwordInputTextLayout.editText?.text.toString().trim()
            val confirmPassword = binding.confirmPasswordInputTextLayout.editText?.text.toString().trim()

            if (validateInputs(firstName, lastName, instiId, email, password, confirmPassword)) {
                registerUser(firstName, lastName, instiId, email, password)
            }
        }

        binding.textView7.setOnClickListener {
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
            finish()
        }
    }

    private fun validateInputs(
        firstName: String,
        lastName: String,
        instiId: String,
        email: String,
        password: String,
        confirmPassword: String
    ): Boolean {
        if (firstName.isEmpty() || lastName.isEmpty() || instiId.isEmpty() || email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "All fields are required", Toast.LENGTH_SHORT).show()
            return false
        }
        if (!email.endsWith("@cit.edu")) {
            Toast.makeText(this, "Please enter a valid CIT email", Toast.LENGTH_SHORT).show()
            return false
        }
        if (password != confirmPassword) {
            Toast.makeText(this, "Passwords do not match", Toast.LENGTH_SHORT).show()
            return false
        }
        return true
    }

    private fun registerUser(firstName: String, lastName: String, instiId: String, email: String, password: String) {
        val apiService = RetrofitInstance.retrofit.create(ApiService::class.java)

        val userDetails = JsonObject().apply {
            addProperty("first_name", firstName)
            addProperty("last_name", lastName)
            addProperty("insti_id", instiId)
            addProperty("email", email)
            addProperty("password", password)

            val role = JsonObject().apply {
                addProperty("role_id", 1)
            }
            add("role", role)
        }

        apiService.register(userDetails).enqueue(object : Callback<Void> {
            override fun onResponse(call: Call<Void>, response: Response<Void>) {
                if (response.isSuccessful) {
                    navigateToRegisterSuccess()
                } else {
                    Log.e("RegisterActivity", "Registration failed: ${response.message()}")
                    Toast.makeText(this@RegisterActivity, "Registration failed: ${response.message()}", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<Void>, t: Throwable) {
                Log.e("RegisterActivity", "Error: ${t.message}", t)
                Toast.makeText(this@RegisterActivity, "Network error. Please try again.", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun navigateToRegisterSuccess() {
        val intent = Intent(this, RegisterSuccessActivity::class.java)
        startActivity(intent)
        finish()
    }
}