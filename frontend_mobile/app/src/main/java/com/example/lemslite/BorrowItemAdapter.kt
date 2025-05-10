package com.example.lemslite

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView

class BorrowItemAdapter (
    context: Context,
    private val items: List<BorrowItem>
) : ArrayAdapter<BorrowItem>(context, 0, items) {

    // Override the getView method to customize how each item in the list is displayed
    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        // Get the current borrow item
        val borrowItem = getItem(position)

        // Reuse a view if possible
        val view = convertView ?: LayoutInflater.from(context).inflate(R.layout.item_borrow, parent, false)

        // Find and update the views with data from the current item
        val itemNameTextView = view.findViewById<TextView>(R.id.itemName)
        val categoryNameTextView = view.findViewById<TextView>(R.id.categoryName)

        itemNameTextView.text = borrowItem?.itemName
        categoryNameTextView.text = borrowItem?.categoryName

        return view
    }
}