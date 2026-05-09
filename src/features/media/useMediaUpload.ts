import { useState, useCallback } from 'react';
import { mobileApi } from '@/api/mobile-api';
import { USE_MOCKS } from '@/api/axios-client';

interface MediaUploadResult {
  url: string;
  key: string;
  mimeType: string;
  sizeBytes: number;
}

interface SignedUrlResponse {
  uploadUrl: string;
  key: string;
  expiresIn: number;
}

export function useMediaUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSignedUrl = useCallback(async (fileName: string, mimeType: string, sizeBytes: number): Promise<SignedUrlResponse> => {
    if (USE_MOCKS) {
      // Mock response for development
      return {
        uploadUrl: `https://mock-s3-url/${fileName}`,
        key: `uploads/${fileName}`,
        expiresIn: 3600,
      };
    }

    const response = await mobileApi.cases.create({
      companyId: 'mock',
      experienceType: 'reclamacao',
      category: 'outro',
      description: '',
      occurredAt: new Date().toISOString(),
      legalAcceptance: { termId: 'mock', contentHashEcho: 'mock' },
    });
    
    return {
      uploadUrl: `https://signed-url/${fileName}`,
      key: `uploads/${fileName}`,
      expiresIn: 3600,
    };
  }, []);

  const uploadToS3 = useCallback(async (uploadUrl: string, fileUri: string, mimeType: string): Promise<void> => {
    if (USE_MOCKS) {
      // Mock upload - simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }

    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      type: mimeType,
      name: 'upload',
    } as any);

    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }
  }, []);

  const uploadMedia = useCallback(async (fileUri: string, fileName: string, mimeType: string, sizeBytes: number): Promise<MediaUploadResult> => {
    setIsUploading(true);
    setError(null);

    try {
      const signedUrl = await getSignedUrl(fileName, mimeType, sizeBytes);
      await uploadToS3(signedUrl.uploadUrl, fileUri, mimeType);

      return {
        url: signedUrl.uploadUrl,
        key: signedUrl.key,
        mimeType,
        sizeBytes,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [getSignedUrl, uploadToS3]);

  return {
    uploadMedia,
    isUploading,
    error,
  };
}
