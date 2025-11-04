declare module "cloudinary" {
  export interface UploadApiResponse {
    secure_url: string;
    public_id: string;
  }

  export interface UploadApiErrorResponse {
    message: string;
  }

  export const v2: {
    config: (opts: { cloudinary_url?: string }) => void;

    uploader: {
      upload_stream: (
        options: Record<string, any>,
        callback: (
          error: UploadApiErrorResponse | null,
          result?: UploadApiResponse
        ) => void
      ) => NodeJS.WritableStream;

      destroy: (
        public_id: string,
        options?: Record<string, any>
      ) => Promise<{ result: string }>;
    };
  };

  export default v2;
}
