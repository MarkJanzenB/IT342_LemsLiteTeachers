package com.example.lemslite

import android.content.Intent
import android.os.Bundle
import android.widget.ImageView
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import androidx.core.content.edit

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

        val jwtService = JwtService()
        val token = sharedPreferences.getString("jwt_token", null)

        if (token != null) {
            val userId = jwtService.getSubFromToken(token)
            val fullName = jwtService.getFullNameFromToken(token)

            findViewById<TextView>(R.id.userId).text = userId ?: "N/A"
            findViewById<TextView>(R.id.userName).text = fullName ?: "N/A"
        }

        val logoutContainer = findViewById<androidx.constraintlayout.widget.ConstraintLayout>(R.id.logoutContainer)
        logoutContainer.setOnClickListener {
            showLogoutDialog()
        }

        val accountSettingsContainer = findViewById<androidx.constraintlayout.widget.ConstraintLayout>(R.id.accountSettingsContainer)
        accountSettingsContainer.setOnClickListener {
            val intent = Intent(this, AccountSettingsActivity::class.java)
            startActivity(intent)
        }

        val backIcon = findViewById<ImageView>(R.id.backIcon)
        backIcon.setOnClickListener {
            finish()
        }
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
        sharedPreferences.edit { remove("jwt_token") }

        val intent = Intent(this, LandingPageActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
    }
}