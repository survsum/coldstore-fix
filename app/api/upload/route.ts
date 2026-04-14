import { NextRequest, NextResponse } from 'next/server';

// Vercel doesn't support local file writes.
// Two options supported:
//   1. CLOUDINARY_URL set → uploads to Cloudinary (free tier = 25GB)
//   2. No CLOUDINARY_URL → returns error telling admin to use image URL instead

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const ACCEPTED_TYPES = [
  'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
  'image/gif', 'image/avif', 'image/heic', 'image/heif',
  'image/svg+xml', 'image/bmp',
];

export async function POST(req: NextRequest) {
  // Auth
  if (req.cookies.get('admin_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large. Max 10MB.' }, { status: 400 });
    }

    const isImage =
      ACCEPTED_TYPES.includes(file.type) ||
      /\.(jpg|jpeg|png|webp|gif|avif|heic|heif|svg|bmp)$/i.test(file.name);

    if (!isImage) {
      return NextResponse.json({ error: 'Please upload a valid image file.' }, { status: 400 });
    }

    // ── Cloudinary upload (recommended for production) ──
    const cloudinaryUrl = process.env.CLOUDINARY_URL;
    const cloudName     = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset  = process.env.CLOUDINARY_UPLOAD_PRESET;

    if (cloudName && uploadPreset) {
      const bytes  = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const dataUri = `data:${file.type};base64,${base64}`;

      const cloudFormData = new FormData();
      cloudFormData.append('file', dataUri);
      cloudFormData.append('upload_preset', uploadPreset);
      cloudFormData.append('folder', 'colddog-products');

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: cloudFormData }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || 'Cloudinary upload failed');
      }

      const data = await res.json();
      return NextResponse.json({ url: data.secure_url, filename: data.public_id });
    }

    // ── No cloud storage configured ──
    // In development (not Vercel), fall through to local save
    if (process.env.NODE_ENV === 'development') {
      const { writeFile, mkdir } = await import('fs/promises');
      const { default: path }   = await import('path');

      const ext      = file.name.split('.').pop() || 'jpg';
      const filename = `product_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(uploadDir, filename), buffer);
      return NextResponse.json({ url: `/uploads/${filename}`, filename });
    }

    // Production without Cloudinary
    return NextResponse.json({
      error:
        'Image upload requires Cloudinary. Add CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET to your Vercel environment variables, or paste an image URL directly instead.',
    }, { status: 501 });

  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
