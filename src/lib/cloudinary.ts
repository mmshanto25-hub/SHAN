/**
 * Cloudinary Unsigned Upload Utility
 * Uses ONLY unsigned upload with upload_preset = "portfolio_vlogs".
 * Strictly NO API Key or Secret in the frontend.
 */

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format?: string;
  bytes?: number;
  duration?: number;
  width?: number;
  height?: number;
}

export interface CloudinaryUploadOptions {
  resourceType?: 'video' | 'image' | 'auto';
  onProgress?: (percent: number) => void;
}

export async function uploadToCloudinaryUnsigned(
  file: File,
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = 'portfolio_vlogs';

  if (!cloudName) {
    throw new Error(
      'Cloudinary cloud name is missing. Please ensure VITE_CLOUDINARY_CLOUD_NAME is defined in your .env / environment variables.'
    );
  }

  // Use video endpoint for video files or as specified
  const isVideo = file.type.startsWith('video/') || options.resourceType === 'video';
  const resourceType = options.resourceType || (isVideo ? 'video' : 'image');
  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint);

    // Track real-time upload progress (0 - 100%)
    if (xhr.upload && options.onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          options.onProgress?.(percent);
        }
      };
    }

    xhr.onload = () => {
      let response: any = {};
      try {
        response = JSON.parse(xhr.responseText);
      } catch {
        // Fallback for non-JSON response
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        if (!response.secure_url || !response.public_id) {
          reject(new Error('Cloudinary response did not return secure_url or public_id.'));
          return;
        }

        // Return strictly the secure_url and public_id as required
        resolve({
          secure_url: response.secure_url,
          public_id: response.public_id,
          format: response.format,
          bytes: response.bytes,
          duration: response.duration,
          width: response.width,
          height: response.height,
        });
      } else {
        const errorMsg =
          response?.error?.message ||
          xhr.statusText ||
          `Upload failed with status ${xhr.status}`;

        // Specific detection for missing preset or unsigned upload error
        if (
          errorMsg.toLowerCase().includes('preset') ||
          errorMsg.toLowerCase().includes('unsigned')
        ) {
          reject(
            new Error(
              `Upload preset '${uploadPreset}' error: ${errorMsg}. Please verify that an unsigned upload preset named '${uploadPreset}' is configured in your Cloudinary Settings -> Upload -> Upload presets.`
            )
          );
        } else {
          reject(new Error(`Cloudinary upload error: ${errorMsg}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error: Could not reach Cloudinary upload API. Check your internet connection.'));
    };

    xhr.send(formData);
  });
}
