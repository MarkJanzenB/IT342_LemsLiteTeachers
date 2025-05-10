package com.example.lemslite

import ApiService
import android.content.Context.MODE_PRIVATE
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.ListView
import android.widget.TextView
import android.widget.Toast
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.lemslite.BorrowItemAdapter

class BorrowingsActivity : AppCompatActivity() {

    private lateinit var recyclerView: ListView
    private lateinit var backIcon: ImageView
    private lateinit var accountTitle: TextView
    private lateinit var userIcon: ImageView
    private lateinit var bottomNavBar: LinearLayout

    private fun getLoggedInUserUid(): String? {
        val token = getSharedPreferences("user_session", MODE_PRIVATE).getString("jwt_token", null)
        return token?.let {
            val jwtService = JwtService()
            jwtService.getUidFromToken(it)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_borrowings)

        val uid = getLoggedInUserUid()
        if (uid != null) {
            fetchBorrowItems(uid)
        } else {
            Toast.makeText(this, "User ID not found", Toast.LENGTH_SHORT).show()
        }

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

        findViewById<LinearLayout>(R.id.scheduleNavButton).setOnClickListener {
            startActivity(Intent(this, ScheduleActivity::class.java))
        }

        findViewById<LinearLayout>(R.id.inventoryNavButton).setOnClickListener {
            startActivity(Intent(this, InventoryActivity::class.java))
        }

        findViewById<LinearLayout>(R.id.reportsNavButton).setOnClickListener {
            startActivity(Intent(this, ReportsActivity::class.java))
        }


    }

    private fun fetchBorrowItems(uid: String) {
        val apiService = RetrofitInstance.retrofit.create(ApiService::class.java)
        apiService.getBorrowItemsByUid(uid).enqueue(object : Callback<List<BorrowItem>> {
            override fun onResponse(call: Call<List<BorrowItem>>, response: Response<List<BorrowItem>>) {
                if (response.isSuccessful) {
                    val items = response.body() ?: emptyList()
                    // Set the adapter for ListView or RecyclerView
                    val adapter = BorrowItemAdapter(this@BorrowingsActivity, items)
                    recyclerView.adapter = adapter
                } else {
                    Toast.makeText(this@BorrowingsActivity, "Failed to load items", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<List<BorrowItem>>, t: Throwable) {
                Toast.makeText(this@BorrowingsActivity, "Network error", Toast.LENGTH_SHORT).show()
            }
        })
    }
}