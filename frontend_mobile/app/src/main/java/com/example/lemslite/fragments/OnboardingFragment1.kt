package com.example.lemslite.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import androidx.fragment.app.Fragment
import androidx.viewpager2.widget.ViewPager2
import com.example.lemslite.R

class OnboardingFragment1 : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_onboarding1, container, false)

        val viewPager = requireActivity().findViewById<ViewPager2>(R.id.viewPager)

        val nextButton = view.findViewById<Button>(R.id.btn_next)
        nextButton.setOnClickListener {
            viewPager.currentItem = 1
        }

        return view
    }
}