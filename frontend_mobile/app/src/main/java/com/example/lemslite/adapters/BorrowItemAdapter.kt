package com.example.lemslite.adapters

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.lemslite.R
import com.example.lemslite.models.BorrowItem
import com.example.lemslite.models.Item

class BorrowItemAdapter(private var items: List<BorrowItem>) : RecyclerView.Adapter<BorrowItemAdapter.BorrowItemViewHolder>() {

    inner class BorrowItemViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val borrowedId: TextView = itemView.findViewById(R.id.borrowedId)
        val itemName: TextView = itemView.findViewById(R.id.itemName)
        val categoryName: TextView = itemView.findViewById(R.id.categoryName)
        val quantity: TextView = itemView.findViewById(R.id.quantity)
        val status: TextView = itemView.findViewById(R.id.status)
        val borrowedDate: TextView = itemView.findViewById(R.id.borrowedDate)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): BorrowItemViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_borrow, parent, false)
        return BorrowItemViewHolder(view)
    }

    override fun onBindViewHolder(holder: BorrowItemViewHolder, position: Int) {
        val item = items[position]
        holder.borrowedId.text = " ${item.referenceCode}"
        holder.itemName.text = " ${item.itemName}"
        holder.categoryName.text = " ${item.categoryName}"
        holder.quantity.text = " ${item.quantity}"
        holder.status.text = " ${item.status}"
        holder.borrowedDate.text = " ${item.dateCreated}"
    }

    override fun getItemCount(): Int = items.size

    fun updateItems(newItems: List<BorrowItem>) {
        items = newItems
        notifyDataSetChanged()
    }
}