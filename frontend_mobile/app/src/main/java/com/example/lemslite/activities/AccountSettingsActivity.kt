package com.example.lemslite.activities

import android.content.Intent
import android.os.Bundle
import android.widget.ImageView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.lemslite.R

class AccountSettingsActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_account_settings)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val backIcon = findViewById<ImageView>(R.id.backIcon)
        backIcon.setOnClickListener {
            finish()
        }

        findViewById<ConstraintLayout>(R.id.accountSettingsContainer).setOnClickListener {
            startActivity(Intent(this, EditProfilePictureActivity::class.java))
        }

        findViewById<ConstraintLayout>(R.id.fullNameContainer).setOnClickListener {
            startActivity(Intent(this, EditFullNameActivity::class.java))
        }

        findViewById<ConstraintLayout>(R.id.emailContainer).setOnClickListener {
            startActivity(Intent(this, EditEmailActivity::class.java))
        }

        findViewById<ConstraintLayout>(R.id.changePasswordContainer).setOnClickListener {
            startActivity(Intent(this, ChangePasswordActivity::class.java))
        }
    }
}