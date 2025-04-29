package com.example.lemslite;

import android.content.Intent;
import android.os.Bundle;
import android.view.Gravity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.PopupMenu;
import androidx.appcompat.widget.Toolbar;
import androidx.cardview.widget.CardView;

import com.google.android.material.bottomnavigation.BottomNavigationView;

public class BorrowHistoryActivity extends AppCompatActivity {

    private CardView cardBorrowings, cardReturns;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_borrowhistory_landing);

        cardBorrowings = findViewById(R.id.card_borrowings);
        cardReturns = findViewById(R.id.card_returns);

        cardBorrowings.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Open Borrowings Page
                startActivity(new Intent(BorrowHistoryActivity.this, BorrowingsActivity.class));
            }
        });

        cardReturns.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Open Returns Page
                startActivity(new Intent(BorrowHistoryActivity.this, ReturnsActivity.class));
            }
        });

        BottomNavigationView bottomNav = findViewById(R.id.bottom_navigation);
        bottomNav.setOnItemSelectedListener(item -> {
            int itemId = item.getItemId();
            if (itemId == R.id.nav_schedule) {
                startActivity(new Intent(BorrowHistoryActivity.this, LoginActivity.class));
                return true;
            } else if (itemId == R.id.nav_inventory) {
                startActivity(new Intent(BorrowHistoryActivity.this, LoginActivity.class));
                return true;
            } else if (itemId == R.id.nav_reports) {
                startActivity(new Intent(BorrowHistoryActivity.this, LoginActivity.class));
                return true;
            } else if (itemId == R.id.nav_borrow_history) {
                return true;
            }
            return false;
        });

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.bar_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        if (item.getItemId() == R.id.action_profile) {
            View menuItemView = findViewById(R.id.toolbar); // anchor view for the popup

            PopupMenu popup = new PopupMenu(this, menuItemView, Gravity.END);
            popup.getMenuInflater().inflate(R.menu.profile_menu, popup.getMenu());

            popup.setOnMenuItemClickListener(menuItem -> {
                int id = menuItem.getItemId();
                if (id == R.id.menu_settings) {
                    Toast.makeText(this, "Opening Settings", Toast.LENGTH_SHORT).show();
                    // startActivity(new Intent(this, ProfileActivity.class));
                    return true;
                } else if (id == R.id.menu_logout) {
                    Toast.makeText(this, "Logging out...", Toast.LENGTH_SHORT).show();
                    // TODO: Add logout logic here
                    return true;
                }
                return false;
            });

            popup.show();
            return true;
        }

        return super.onOptionsItemSelected(item);
    }


}