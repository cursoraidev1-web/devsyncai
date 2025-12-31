/**
 * Supabase Storage Utility
 * 
 * This utility handles file uploads to Supabase Storage buckets.
 * Make sure to configure your Supabase credentials in .env file.
 */

// Supabase client initialization
let supabaseClient = null;
let supabaseInitialized = false;

// Initialize Supabase client
const initSupabase = () => {
  if (typeof window === 'undefined') return null;
  
  // Return cached client if already initialized
  if (supabaseClient) return supabaseClient;
  
  // Check if already attempted and failed
  if (supabaseInitialized && !supabaseClient) return null;
  
  supabaseInitialized = true;
  
  // Lazy load @supabase/supabase-js
  try {
    const { createClient } = require('@supabase/supabase-js');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Check which variables are missing and provide specific error
    const missingVars = [];
    if (!supabaseUrl) {
      missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
    }
    if (!supabaseAnonKey) {
      missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }
    
    if (missingVars.length > 0) {
      const errorMessage = `Missing environment variable(s): ${missingVars.join(', ')}. Please add ${missingVars.length === 1 ? 'it' : 'them'} to your .env file and restart the development server.`;
      console.error('Supabase configuration error:', errorMessage);
      // Store error message for later retrieval
      initSupabase.lastError = errorMessage;
      return null;
    }
    
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    return supabaseClient;
  } catch (error) {
    const errorMessage = 'Supabase library not installed. Run: npm install @supabase/supabase-js';
    console.warn(errorMessage);
    console.warn('Error:', error.message);
    initSupabase.lastError = errorMessage;
    return null;
  }
};

/**
 * Upload a file to Supabase Storage
 * @param {File} file - The file to upload
 * @param {string} bucketName - The name of the Supabase bucket
 * @param {string} path - The path within the bucket (e.g., 'documents/project-123/file.pdf')
 * @param {Object} options - Additional options (onProgress callback, etc.)
 * @returns {Promise<{url: string, path: string}>} The public URL and path of the uploaded file
 */
export const uploadFile = async (file, bucketName, path, options = {}) => {
  const supabase = initSupabase();
  
  if (!supabase) {
    const errorMsg = initSupabase.lastError || 'Supabase not configured. Please check your environment variables.';
    throw new Error(errorMsg);
  }
  
  try {
    // Prepare upload options
    const uploadOptions = {
      cacheControl: '3600',
      upsert: false
    };

    // Extract onProgress if provided (Supabase doesn't support it directly, but we can track it)
    const { onProgress, contentType, ...restOptions } = options;
    Object.assign(uploadOptions, restOptions);
    
    if (contentType) {
      uploadOptions.contentType = contentType;
    }

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(path, file, uploadOptions);
    
    if (error) {
      throw error;
    }

    // Call progress callback if provided (100% complete)
    if (onProgress && typeof onProgress === 'function') {
      onProgress(100);
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(path);
    
    return {
      url: urlData.publicUrl,
      path: data.path
    };
  } catch (error) {
    console.error('Error uploading file to Supabase:', error);
    throw error;
  }
};

/**
 * Delete a file from Supabase Storage
 * @param {string} bucketName - The name of the Supabase bucket
 * @param {string} path - The path of the file to delete
 * @returns {Promise<void>}
 */
export const deleteFile = async (bucketName, path) => {
  const supabase = initSupabase();
  
  if (!supabase) {
    const errorMsg = initSupabase.lastError || 'Supabase not configured. Please check your environment variables.';
    throw new Error(errorMsg);
  }
  
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([path]);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting file from Supabase:', error);
    throw error;
  }
};

/**
 * Get a public URL for a file in Supabase Storage
 * @param {string} bucketName - The name of the Supabase bucket
 * @param {string} path - The path of the file
 * @returns {string} The public URL
 */
export const getPublicUrl = (bucketName, path) => {
  const supabase = initSupabase();
  
  if (!supabase) {
    return null;
  }
  
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(path);
  
  return data.publicUrl;
};

/**
 * Download a file from Supabase Storage
 * @param {string} bucketName - The name of the Supabase bucket
 * @param {string} path - The path of the file to download
 * @returns {Promise<Blob>} The file as a Blob
 */
export const downloadFile = async (bucketName, path) => {
  const supabase = initSupabase();
  
  if (!supabase) {
    const errorMsg = initSupabase.lastError || 'Supabase not configured. Please check your environment variables.';
    throw new Error(errorMsg);
  }
  
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(path);
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error downloading file from Supabase:', error);
    throw error;
  }
};

export default {
  uploadFile,
  deleteFile,
  getPublicUrl,
  downloadFile,
  initSupabase
};

