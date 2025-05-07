package com.example.lemslite

import android.animation.ObjectAnimator
import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.animation.AccelerateDecelerateInterpolator
import android.widget.ImageView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.content.edit

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

        val imageView = findViewById<ImageView>(R.id.imageView2)
        val scaleX = ObjectAnimator.ofFloat(imageView, "scaleX", 0.5f, 1.2f, 1f)
        val scaleY = ObjectAnimator.ofFloat(imageView, "scaleY", 0.5f, 1.2f, 1f)

        scaleX.duration = 1000
        scaleY.duration = 1000

        scaleX.interpolator = AccelerateDecelerateInterpolator()
        scaleY.interpolator = AccelerateDecelerateInterpolator()

        scaleX.start()
        scaleY.start()

        val rootView = findViewById<androidx.constraintlayout.widget.ConstraintLayout>(R.id.main)

        val handler = Handler(Looper.getMainLooper())
        val transitionRunnable = Runnable {
            navigateToOnboarding()
        }
        handler.postDelayed(transitionRunnable, delayMillis)

        rootView.setOnClickListener {
            handler.removeCallbacks(transitionRunnable)
            navigateToOnboarding()
        }
    }

    private fun navigateToOnboarding() {
        val sharedPreferences = getSharedPreferences("user_session", MODE_PRIVATE)
        val token = sharedPreferences.getString("jwt_token", null)

        if (token != null) {
            val jwtService = JwtService()
            if (!jwtService.isTokenExpired(token)) {
                val intent = Intent(this, HomeActivity::class.java)
                startActivity(intent)
            } else {
                sharedPreferences.edit { clear() }
                Toast.makeText(this, "Session expired. Please log in again.", Toast.LENGTH_SHORT).show()
                val intent = Intent(this, LoginActivity::class.java)
                startActivity(intent)
            }
        } else {
            val intent = Intent(this, OnboardingActivity::class.java)
            startActivity(intent)
        }
        finish()
    }
}