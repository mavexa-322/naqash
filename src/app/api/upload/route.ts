import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: 'No valid image file provided.' },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be a valid image format.' },
        { status: 400 }
      );
    }

    // Validate size (15MB maximum)
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image size exceeds maximum limit of 15MB.' },
        { status: 400 }
      );
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'slqao1ue';
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'naqash';

    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', file);
    cloudinaryFormData.append('upload_preset', uploadPreset);

    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: cloudinaryFormData,
      }
    );

    const data = await cloudinaryRes.json();

    if (!cloudinaryRes.ok || data.error) {
      console.error('Cloudinary API upload error:', data.error);
      return NextResponse.json(
        { error: data.error?.message || 'Failed to upload image to Cloudinary.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      url: data.secure_url || data.url,
      public_id: data.public_id,
      format: data.format,
      width: data.width,
      height: data.height,
    });
  } catch (error) {
    console.error('Upload handler error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error during upload.' },
      { status: 500 }
    );
  }
}
