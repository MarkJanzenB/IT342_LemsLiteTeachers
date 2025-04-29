import { Button, IconButton, Snackbar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import React from "react";
import { useRef, useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import { getJWTUid } from "../Authentication/jwt";
import axios from "axios";

const CloudinaryWidget = ({onClose}) => {
    const cloudinaryRef = useRef();
    const widgetRef = useRef();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const jwtToken = localStorage.getItem("jwtToken");
    useEffect(() => {
        cloudinaryRef.current = window.cloudinary;
        widgetRef.current = cloudinaryRef.current.createUploadWidget({
            cloudName: 'dsvbkoq9d',
            uploadPreset: 'upload_testing',
            showCompletedButton: false, 
            showUploadMoreButton: false,
            multiple: false,
            cropping: true,
            croppingAspectRatio: 1,
            showSkipCropButton: false,
            clientAllowedFormats: ["image"],
            maxFileSize: 512000,
            showAdvancedOptions: false,
        }, function(error, result){
            if(result.event === 'success'){
                axios.put(`https://it342-lemsliteteachers.onrender.com/user/editpfp`, 
                    {
                        pfp_url: result.info.secure_url,
                        uid: getJWTUid(),
                    },
                    {
                        headers: {
                            "Authorization": `Bearer ${jwtToken}`
                        }
                    }
                )
                onClose(result.info.secure_url);
                setOpenSnackbar(true);
                widgetRef.current.close()
            }
        });
    }, [])

    return(
        <>
        <Button
            component="label"
            variant="contained"
            startIcon={<EditIcon />}
            sx={{
                width: '500px',
                backgroundColor: '#056765',
                '&:hover': { backgroundColor: '#044e4d' },
                fontSize: '2rem'
                }}
            onClick={() => widgetRef.current.open()}
        >
            Change Profile Photo
        </Button>
        <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={() => setOpenSnackbar(false)}
            message={'Profile photo updated successfully!'}
            action={
                <IconButton size="small" color="inherit" onClick={() => setOpenSnackbar(false)}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            }
        />
        </>
    )
};

export default CloudinaryWidget;