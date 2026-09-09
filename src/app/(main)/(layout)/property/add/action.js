'use server';

import { createPropertyAction } from '@/actions/propertiesActions';
import { uploadImageAction } from '@/actions/uploadsActions';
import config from '@/config/config';

/**
 * Résout l'URL finale d'une image : upload le fichier s'il est fourni,
 * sinon retombe sur l'URL saisie manuellement.
 * @param {File|null} file - Fichier sélectionné via l'input file (peut être vide)
 * @param {string|null} url - URL saisie dans le champ texte
 * @param {string} purpose - Contexte de l'upload (ex: 'property-cover', 'user-picture')
 * @returns {Promise<string|null>} L'URL de l'image, ou `null` si ni fichier ni URL
 */
async function resolveImageUrl(file, url, purpose) {
  if (file && file.size > 0) {
    const uploadForm = new FormData();
    uploadForm.append('file', file);
    uploadForm.append('purpose', purpose);

    const result = await uploadImageAction(uploadForm);

    return resolveUrl(result.url);
  }

  return resolveUrl(url);
}

function resolveUrl(url) {
  if (!url) return null;

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  return `${config.apiUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
}

/**
 * Server Action (`useActionState`) de création d'un logement à partir du
 * FormData du formulaire "Ajouter une propriété". Upload les images
 * (cover, photos du logement, photo hôte) avant de créer le logement.
 * @param {Object|null} prevState - État précédent renvoyé par `useActionState` (non utilisé ici)
 * @param {FormData} formData - Données du formulaire soumis
 * @returns {Promise<{success: true, property: Object}|{error: string}>}
 */
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