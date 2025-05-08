package com.example.lemslite.activities

import android.content.Intent
import android.os.Bundle
import android.widget.ImageView
import android.widget.LinearLayout
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.lemslite.R

class ScheduleActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_schedule)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val userIcon = findViewById<ImageView>(R.id.userIcon)

        userIcon.setOnClickListener {
            val intent = Intent(this, AccountActivity::class.java)
            startActivity(intent)
        }

        val backIcon = findViewById<ImageView>(R.id.backIcon)
        backIcon.setOnClickListener {
            finish()
        }

        findViewById<LinearLayout>(R.id.homeNavButton).setOnClickListener {
            startActivity(Intent(this, HomeActivity::class.java))
        }

        findViewById<LinearLayout>(R.id.inventoryNavButton).setOnClickListener {
            startActivity(Intent(this, InventoryActivity::class.java))
        }

        findViewById<LinearLayout>(R.id.reportsNavButton).setOnClickListener {
            startActivity(Intent(this, ReportsActivity::class.java))
        }

        findViewById<LinearLayout>(R.id.historyNavButton).setOnClickListener {
            startActivity(Intent(this, BorrowHistoryActivity::class.java))
        }
    }
}