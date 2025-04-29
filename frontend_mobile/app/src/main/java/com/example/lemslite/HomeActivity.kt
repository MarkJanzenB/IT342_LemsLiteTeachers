package com.example.lemslite

import android.content.Intent
import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import android.widget.ImageView

class HomeActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_home)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val profileIcon = findViewById<ImageView>(R.id.profileIcon)
        profileIcon.setOnClickListener {
            val intent = Intent(this, AccountActivity::class.java)
            startActivity(intent)
        }

//        findViewById<LinearLayout>(R.id.bottomNavBar).apply {
//            findViewById<LinearLayout>(R.id.button1).setOnClickListener {
//                startActivity(Intent(this@HomeActivity, ScheduleActivity::class.java))
//            }
//            findViewById<LinearLayout>(R.id.button2).setOnClickListener {
//                startActivity(Intent(this@HomeActivity, InventoryActivity::class.java))
//            }
//            findViewById<LinearLayout>(R.id.button3).setOnClickListener {
//                startActivity(Intent(this@HomeActivity, ReportsActivity::class.java))
//            }
//            findViewById<LinearLayout>(R.id.button4).setOnClickListener {
//                startActivity(Intent(this@HomeActivity, BorrowHistoryActivity::class.java))
//            }
//        }
    }
}