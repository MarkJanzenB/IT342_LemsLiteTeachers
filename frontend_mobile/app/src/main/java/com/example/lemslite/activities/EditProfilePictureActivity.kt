package com.example.lemslite.activities

import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bumptech.glide.Glide
import com.example.lemslite.databinding.ActivityEditProfilePictureBinding
import com.example.lemslite.instances.RetrofitInstance
import com.example.lemslite.models.UserDetailsResponse
import com.example.lemslite.services.ApiService
import com.example.lemslite.services.CloudinaryService
import com.example.lemslite.services.JwtService
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import com.yalantis.ucrop.UCrop

class EditProfilePictureActivity : AppCompatActivity() {
    private lateinit var binding: ActivityEditProfilePictureBinding
    private val PICK_IMAGE_REQUEST = 1
    private val CAPTURE_IMAGE_REQUEST = 2
    private var imageUri: Uri? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityEditProfilePictureBinding.inflate(layoutInflater)
        setContentView(binding.root)

        CloudinaryService.initialize(this)

        binding.backIcon.setOnClickListener { finish() }

        val sharedPreferences = getSharedPreferences("user_session", MODE_PRIVATE)
        val token = sharedPreferences.getString("jwt_token", null)

        if (token != null) {
            val jwtService = JwtService()
            val uid = jwtService.getUidFromToken(token)
            if (uid != null) {
                fetchUserDetails(uid)
            } else {
                Toast.makeText(this, "Invalid user ID. Please log in again.", Toast.LENGTH_SHORT).show()
            }
        }

        binding.uploadImageButton.setOnClickListener { showImageOptions() }
        binding.saveChangesButton.setOnClickListener { saveProfilePicture() }
    }

    private fun showImageOptions() {
        val options = arrayOf("Open Gallery", "Capture Image")
        val builder = android.app.AlertDialog.Builder(this)
        builder.setTitle("Choose an option")
        builder.setItems(options) { _, which ->
            when (which) {
                0 -> openGallery()
                1 -> captureImage()
            }
        }
        builder.show()
    }

    private fun openGallery() {
        val intent = Intent(Intent.ACTION_GET_CONTENT).apply {
            type = "image/*"
            addCategory(Intent.CATEGORY_OPENABLE)
        }
        startActivityForResult(Intent.createChooser(intent, "Select Picture"), PICK_IMAGE_REQUEST)
    }

    private fun captureImage() {
        val intent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
        startActivityForResult(intent, CAPTURE_IMAGE_REQUEST)
    }

    private fun startCropActivity(uri: Uri) {
        val destinationUri = Uri.fromFile(File(cacheDir, "cropped_image.jpg"))
        val options = UCrop.Options().apply {
            setCompressionFormat(Bitmap.CompressFormat.JPEG)
            setCompressionQuality(90)
            setToolbarTitle("Crop Image")
        }

        UCrop.of(uri, destinationUri)
            .withAspectRatio(1f, 1f)
            .withOptions(options)
            .start(this)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (resultCode == RESULT_OK) {
            when (requestCode) {
                PICK_IMAGE_REQUEST -> {
                    imageUri = data?.data
                    imageUri?.let { startCropActivity(it) }
                }
                CAPTURE_IMAGE_REQUEST -> {
                    val bitmap = data?.extras?.get("data") as? Bitmap
                    bitmap?.let {
                        imageUri = saveBitmapToFile(it)
                        imageUri?.let { startCropActivity(it) }
                    }
                }
                UCrop.REQUEST_CROP -> {
                    val resultUri = UCrop.getOutput(data!!)
                    if (resultUri != null) {
                        imageUri = resultUri
                        binding.profileImage.setImageURI(imageUri)
                    }
                }
            }
        } else if (resultCode == UCrop.RESULT_ERROR) {
            val cropError = UCrop.getError(data!!)
            Toast.makeText(this, "Crop error: ${cropError?.message}", Toast.LENGTH_SHORT).show()
        }
    }

    private fun saveBitmapToFile(bitmap: Bitmap): Uri? {
        val file = File(cacheDir, "temp_image.jpg")
        return try {
            val outputStream = FileOutputStream(file)
            bitmap.compress(Bitmap.CompressFormat.JPEG, 100, outputStream)
            outputStream.flush()
            outputStream.close()
            Uri.fromFile(file)
        } catch (e: IOException) {
            e.printStackTrace()
            null
        }
    }

    private fun saveProfilePicture() {
        imageUri?.let { uri ->
            CloudinaryService.uploadImage(this, uri) { secureUrl ->
                if (secureUrl != null) {
                    Toast.makeText(this, "Profile photo updated successfully!", Toast.LENGTH_SHORT).show()
                    updateProfilePicture(secureUrl)
                } else {
                    Toast.makeText(this, "Failed to upload image.", Toast.LENGTH_SHORT).show()
                }
            }
        } ?: Toast.makeText(this, "No image selected", Toast.LENGTH_SHORT).show()
    }

    private fun updateProfilePicture(secureUrl: String) {
        val jwtToken = getSharedPreferences("user_session", MODE_PRIVATE).getString("jwt_token", null)
        if (jwtToken == null) {
            Toast.makeText(this, "JWT token is missing. Please log in again.", Toast.LENGTH_SHORT).show()
            return
        }

        val jwtService = JwtService()
        val uid = jwtService.getUidFromToken(jwtToken)?.toInt()
        if (uid == null) {
            Toast.makeText(this, "Invalid user ID. Please log in again.", Toast.LENGTH_SHORT).show()
            return
        }

        val apiService = RetrofitInstance.getRetrofit(this).create(ApiService::class.java)
        val requestBody = com.google.gson.JsonObject().apply {
            addProperty("pfp_url", secureUrl)
            addProperty("uid", uid)
        }

        apiService.editPfp(requestBody).enqueue(object : Callback<Void> {
            override fun onResponse(call: Call<Void>, response: Response<Void>) {
                if (response.isSuccessful) {
                    Toast.makeText(this@EditProfilePictureActivity, "Profile photo updated successfully!", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(this@EditProfilePictureActivity, "Failed to update profile photo.", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<Void>, t: Throwable) {
                Toast.makeText(this@EditProfilePictureActivity, "Network error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun fetchUserDetails(uid: Integer) {
        val apiService = RetrofitInstance.getRetrofit(this).create(ApiService::class.java)
        apiService.getUserDetails(uid).enqueue(object : Callback<UserDetailsResponse> {
            override fun onResponse(call: Call<UserDetailsResponse>, response: Response<UserDetailsResponse>) {
                if (response.isSuccessful) {
                    val userDetails = response.body()
                    if (userDetails != null) {
                        val profilePictureUrl = userDetails.pfp
                        if (!profilePictureUrl.isNullOrEmpty()) {
                            Glide.with(this@EditProfilePictureActivity)
                                .load(profilePictureUrl)
                                .into(binding.profileImage)
                        }
                    }
                } else {
                    Toast.makeText(this@EditProfilePictureActivity, "Failed to fetch user details.", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<UserDetailsResponse>, t: Throwable) {
                Toast.makeText(this@EditProfilePictureActivity, "Network error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }
}