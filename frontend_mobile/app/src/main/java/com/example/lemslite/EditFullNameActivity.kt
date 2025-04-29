package com.example.lemslite

import android.os.Bundle
import android.widget.ImageView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class EditFullNameActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_edit_full_name)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val jwtService = JwtService()
        val token = getSharedPreferences("user_session", MODE_PRIVATE).getString("jwt_token", null)

        if (token != null) {
            val firstName = jwtService.getFNameFromToken(token)
            val lastName = jwtService.getLNameFromToken(token)

            findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.firstNameEditText).setText(firstName)
            findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.lastNameEditText).setText(lastName)
        }

        val backIcon = findViewById<ImageView>(R.id.backIcon)
        backIcon.setOnClickListener {
            finish()
        }
    }
}