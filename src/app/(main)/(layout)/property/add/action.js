'use server';

import { createPropertyAction } from '@/actions/propertiesActions';
import { uploadImageAction } from '@/actions/uploadsActions';

async function resolveImageUrl(file, url, purpose) {
  if (file && file.size > 0) {
    const uploadForm = new FormData();
    uploadForm.append('file', file);
    uploadForm.append('purpose', purpose);
    const result = await uploadImageAction(uploadForm);
    return result.url;
  }
  return url || null;
}

export default async function AddProperty(prevState, formData) {
  const title = formData.get('name');
  const description = formData.get('description');
  const postalCode = formData.get('postalCode');
  const localisation = formData.get('localisation');
  const price_per_night = formData.get('price_per_night');
  const hostName = formData.get('hostName');
  const equipments = formData.getAll("equipments");
  const tags = formData.getAll('tags');

  if (!title) {
    return { error: 'Le titre de la propriété est requis' };
  }

  try {
    const coverFile = formData.get('CoverFile');
    const coverUrl = formData.get('CoverUrl');
    const cover = await resolveImageUrl(coverFile, coverUrl, 'property-cover');

    const hostFile = formData.get('hostPictureFile');
    const hostUrl = formData.get('hostPictureUrl');
    const hostPicture = await resolveImageUrl(hostFile, hostUrl, 'user-picture');

    const propertyFiles = formData.getAll('propertyPictureFile');
    const propertyUrls = formData.getAll('propertyPictureUrl');
    const pictures = (
      await Promise.all(
        propertyFiles.map((file, i) =>
          resolveImageUrl(file, propertyUrls[i], 'property-picture')
        )
      )
    ).filter(Boolean);

    const location = [localisation, postalCode].filter(Boolean).join(', ');

    const result = await createPropertyAction({
      title,
      description: description || null,
      cover,
      location: location || null,
      price_per_night,
      host: { name: hostName, picture: hostPicture },
      pictures,
      equipments,
      tags,
    });

    return { success: true, property: result };
  } catch (err) {
    console.log(err);
    return { error: err.data?.error || "Impossible d'ajouter la propriété" };
  }
}