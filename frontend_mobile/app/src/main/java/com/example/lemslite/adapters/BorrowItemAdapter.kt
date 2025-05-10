package com.example.lemslite.adapters

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView
import com.example.lemslite.R
import com.example.lemslite.models.BorrowItem

class BorrowItemAdapter(
    context: Context,
    allItems: List<BorrowItem>,
    uid: Int
) : ArrayAdapter<BorrowItem>(context, 0, allItems.filter { it.userId == uid }) {

    private val items = allItems.filter { it.userId == uid }.toMutableList()

    override fun getCount(): Int = items.size
    override fun getItem(position: Int): BorrowItem? = items[position]

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val borrowItem = getItem(position)
        val view = convertView ?: LayoutInflater.from(context).inflate(R.layout.item_borrow, parent, false)

        view.findViewById<TextView>(R.id.borrowedId).text = "ID: ${borrowItem?.borrowedId}"
        view.findViewById<TextView>(R.id.itemName).text = "Item: ${borrowItem?.itemName}"
        view.findViewById<TextView>(R.id.categoryName).text = "Category: ${borrowItem?.categoryName}"
        view.findViewById<TextView>(R.id.quantity).text = "Quantity: ${borrowItem?.quantity}"
        view.findViewById<TextView>(R.id.status).text = "Status: ${borrowItem?.status}"
        view.findViewById<TextView>(R.id.borrowedDate).text = "Date: ${borrowItem?.borrowedDate.toString()}"

        return view
    }

    // Call notifyDataSetChanged when the data changes
    fun updateData(newItems: List<BorrowItem>) {
        // Update the data
        items.clear()
        items.addAll(newItems)

        // Notify the adapter that the data has changed
        notifyDataSetChanged()
    }
}