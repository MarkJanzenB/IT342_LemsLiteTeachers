package com.example.lemslite.fragments

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import androidx.fragment.app.Fragment
import com.example.lemslite.R
import com.example.lemslite.activities.LandingPageActivity

class OnboardingFragment3 : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_onboarding3, container, false)

        val startButton = view.findViewById<Button>(R.id.btn_start)
        startButton.setOnClickListener {
            val intent = Intent(requireContext(), LandingPageActivity::class.java)
            startActivity(intent)
            requireActivity().finish()
        }

        return view
    }
}