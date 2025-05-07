package com.example.lemslite

import android.animation.ObjectAnimator
import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.view.animation.AccelerateDecelerateInterpolator
import android.widget.ImageView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.core.content.edit
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@SuppressLint("CustomSplashScreen")
class SplashScreenActivity : AppCompatActivity() {
    private val delayMillis: Long = 3000 // 3 seconds delay

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_splash_screen)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        setupAnimation()
        setupNavigation()
    }

    private fun setupAnimation() {
        val imageView = findViewById<ImageView>(R.id.imageView2)
        val scaleX = ObjectAnimator.ofFloat(imageView, "scaleX", 0.5f, 1.2f, 1f)
        val scaleY = ObjectAnimator.ofFloat(imageView, "scaleY", 0.5f, 1.2f, 1f)

        scaleX.duration = 1000
        scaleY.duration = 1000

        scaleX.interpolator = AccelerateDecelerateInterpolator()
        scaleY.interpolator = AccelerateDecelerateInterpolator()

        scaleX.start()
        scaleY.start()
    }

    private fun setupNavigation() {
        val rootView = findViewById<ConstraintLayout>(R.id.main)

        lifecycleScope.launch {
            delay(delayMillis)
            navigateToNextScreen()
        }

        rootView.setOnClickListener {
            navigateToNextScreen()
        }
    }

    private fun navigateToNextScreen() {
        val sharedPreferences = getSharedPreferences("user_session", MODE_PRIVATE)
        val token = sharedPreferences.getString("jwt_token", null)

        if (token != null) {
            val jwtService = JwtService()
            if (!jwtService.isTokenExpired(token)) {
                startActivity(Intent(this, HomeActivity::class.java))
            } else {
                sharedPreferences.edit { clear() }
                Toast.makeText(this, "Session expired. Please log in again.", Toast.LENGTH_SHORT).show()
                startActivity(Intent(this, LoginActivity::class.java))
            }
        } else {
            startActivity(Intent(this, OnboardingActivity::class.java))
        }
        finish()
    }
}