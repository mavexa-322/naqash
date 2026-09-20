import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth/adminAuth';

export async function POST(req: NextRequest) {
  try {
    const session = await verifyAdminSession();
    if (!session.isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized: Administrator privileges required.' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: 'No valid image file provided.' },
        { status: 400 }
      );
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'slqao1ue';
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'naqash';

    // Prepare upload payload for Cloudinary REST API
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
      console.error('Cloudinary API error:', data.error);
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
