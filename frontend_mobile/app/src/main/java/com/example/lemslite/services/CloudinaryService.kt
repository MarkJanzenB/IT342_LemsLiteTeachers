package com.example.lemslite.services

import android.content.Context
import android.net.Uri
import android.util.Log
import android.widget.Toast
import com.cloudinary.android.MediaManager
import com.cloudinary.android.callback.ErrorInfo
import com.cloudinary.android.callback.UploadCallback

object CloudinaryService {

    private const val TAG = "CloudinaryService"

    fun initialize(context: Context) {
        try {
            if (!isInitialized()) {
                val config = mapOf(
                    "cloud_name" to "dsvbkoq9d",
                    "api_key" to "773316863353296",
                    "api_secret" to "1OKCceB-v6NqRJ-Z5YQgOXG7nVc"
                )
                MediaManager.init(context, config)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error initializing Cloudinary: ${e.message}", e)
        }
    }

    private fun isInitialized(): Boolean {
        return try {
            MediaManager.get()
            true
        } catch (e: IllegalStateException) {
            false
        }
    }

    fun uploadImage(context: Context, uri: Uri, callback: (String?) -> Unit) {
        val filePath = uri.path ?: run {
            Toast.makeText(context, "Invalid file path", Toast.LENGTH_SHORT).show()
            callback(null)
            return
        }

        MediaManager.get().upload(filePath)
            .unsigned("upload_testing")
            .callback(object : UploadCallback {
                override fun onStart(requestId: String) {
                    Toast.makeText(context, "Uploading...", Toast.LENGTH_SHORT).show()
                }

                override fun onProgress(requestId: String, bytes: Long, totalBytes: Long) {}

                override fun onSuccess(requestId: String, resultData: Map<*, *>) {
                    val secureUrl = resultData["secure_url"] as? String
                    if (secureUrl != null) {
                        Log.d(TAG, "Upload successful: $secureUrl")
                        callback(secureUrl)
                    } else {
                        Toast.makeText(context, "Failed to retrieve secure URL.", Toast.LENGTH_SHORT).show()
                        callback(null)
                    }
                }

                override fun onError(requestId: String, error: ErrorInfo) {
                    Log.e(TAG, "Upload error: ${error.description}")
                    Toast.makeText(context, "Upload failed: ${error.description}", Toast.LENGTH_SHORT).show()
                    callback(null)
                }

                override fun onReschedule(requestId: String, error: ErrorInfo) {}
            })
            .dispatch()
    }
}