import { useState } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import RNFS from 'react-native-fs';

export const useDownload = () => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [progress, setProgress] = useState(0);

    const requestStoragePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                if (Platform.Version >= 33) {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                    );
                    return granted === PermissionsAndroid.RESULTS.GRANTED;
                } else {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                        {
                            title: "Storage Permission Required",
                            message: "WallCraft needs access to storage to download wallpapers.",
                            buttonNeutral: "Ask Me Later",
                            buttonNegative: "Cancel",
                            buttonPositive: "OK"
                        }
                    );
                    return granted === PermissionsAndroid.RESULTS.GRANTED;
                }
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true; // iOS not supported in this app, but return true just in case
    };

    const download = async (url, id, ext) => {
        try {
            if (!url) {
                Alert.alert('Error', 'Invalid image URL');
                return;
            }

            const hasPermission = await requestStoragePermission();
            if (!hasPermission) {
                Alert.alert('Permission Denied', 'Storage permission is required to save wallpapers.');
                return;
            }

            setIsDownloading(true);
            setProgress(0);

            // Create folder if not exists
            const folderPath = `${RNFS.PicturesDirectoryPath}/WallCraft`;
            const folderExists = await RNFS.exists(folderPath);
            if (!folderExists) {
                await RNFS.mkdir(folderPath);
            }

            const filePath = `${folderPath}/wallhaven-${id}.${ext}`;

            // Check if already downloaded
            const fileExists = await RNFS.exists(filePath);
            if (fileExists) {
                Alert.alert('Already Downloaded', 'This wallpaper is already saved in your gallery.');
                setIsDownloading(false);
                return;
            }

            const downloadJob = RNFS.downloadFile({
                fromUrl: url,
                toFile: filePath,
                progress: (res) => {
                    let progressPercent = (res.bytesWritten / res.contentLength) * 100;
                    setProgress(Math.round(progressPercent));
                },
                progressDivider: 2,
            });

            const result = await downloadJob.promise;

            if (result.statusCode === 200) {
                // Trigger media scanner
                RNFS.scanFile(filePath);
                Alert.alert('Success', 'Wallpaper downloaded to WallCraft folder in Pictures!');
            } else {
                throw new Error(`Status code: ${result.statusCode}`);
            }

        } catch (error) {
            console.error('Download error:', error);
            Alert.alert('Download Failed', error.message || 'An error occurred while downloading.');
        } finally {
            setIsDownloading(false);
            setProgress(0);
        }
    };

    return { download, progress, isDownloading };
};
