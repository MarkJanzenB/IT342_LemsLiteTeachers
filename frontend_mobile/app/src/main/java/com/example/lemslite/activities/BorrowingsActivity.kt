package com.example.lemslite.activities

import android.content.Intent
import android.os.Bundle
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.ListView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.lemslite.models.BorrowItem
import com.example.lemslite.adapters.BorrowItemAdapter
import com.example.lemslite.R
import com.example.lemslite.instances.RetrofitInstance
import com.example.lemslite.models.UserDetailsResponse
import com.example.lemslite.services.ApiService
import com.example.lemslite.services.JwtService
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class BorrowingsActivity : AppCompatActivity() {
    private lateinit var borrowRecyclerView: RecyclerView
    private lateinit var borrowAdapter: BorrowItemAdapter
    private val borrows = mutableListOf<BorrowItem>()
    private val sharedPreferences by lazy {
        getSharedPreferences("user_session", MODE_PRIVATE)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_borrowings)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val userIcon = findViewById<ImageView>(R.id.userIcon)

        val token = sharedPreferences.getString("jwt_token", null)
        val jwtService = JwtService()
        val uid = jwtService.getUidFromToken(token.toString())

        if (token != null) {
            if (uid != null) {
                fetchUserDetails(uid, userIcon)
                fetchBorrowItems(uid)
            } else {
                Toast.makeText(this, "Invalid user ID. Please log in again.", Toast.LENGTH_SHORT).show()
            }
        }

        borrowRecyclerView = findViewById(R.id.borrowView)
        borrowRecyclerView.layoutManager = LinearLayoutManager(this)

        if (uid != null) {
            borrowAdapter = BorrowItemAdapter(this, borrows, uid.toInt())
        }


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

    private fun fetchUserDetails(uid: Integer, userIcon: ImageView) {
        val apiService = RetrofitInstance.getRetrofit(this).create(ApiService::class.java)
        apiService.getUserDetails(uid).enqueue(object : Callback<UserDetailsResponse> {
            override fun onResponse(call: Call<UserDetailsResponse>, response: Response<UserDetailsResponse>) {
                if (response.isSuccessful) {
                    val userDetails = response.body()
                    if (userDetails != null) {
                        val profilePictureUrl = userDetails.pfp
                        if (!profilePictureUrl.isNullOrEmpty()) {
                            Glide.with(this@BorrowingsActivity)
                                .load(profilePictureUrl)
                                .into(userIcon)
                        }
                    }
                } else {
                    Toast.makeText(this@BorrowingsActivity, "Failed to fetch user details.", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<UserDetailsResponse>, t: Throwable) {
                Toast.makeText(this@BorrowingsActivity, "Network error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun fetchBorrowItems(uid: Integer) {
        val apiService = RetrofitInstance.getRetrofit(this).create(ApiService::class.java)
        apiService.getBorrowings().enqueue(object : Callback<List<BorrowItem>> {
            override fun onResponse(call: Call<List<BorrowItem>>, response: Response<List<BorrowItem>>) {
                if (response.isSuccessful) {
                    val allItems = response.body() ?: emptyList()
                    borrows.clear()
                    borrows.addAll(allItems.filter { it.userId == uid.toInt() })
                    borrowAdapter.notifyDataSetChanged()
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