'use client';
import { useRef } from 'react';
import styles from './InputLabel.module.css';
import Image from 'next/image';

/**
 * Champ de formulaire générique (input ou textarea) avec label, tooltip
 * optionnel, et icône calendrier cliquable pour les champs de type date.
 * @param {Object} props
 * @param {string} props.nameId - `id`/`name` du champ
 * @param {string} props.content - Libellé du champ
 * @param {string} props.type - Type HTML de l'input ('date', 'textarea', 'text', etc.). `'textarea'` rend un `<textarea>` au lieu d'un `<input>`
 * @param {boolean} props.isRequired - Rend le champ obligatoire
 * @param {string} props.placeholder - Texte d'aide affiché dans le champ vide
 * @param {string} props.value - Valeur initiale/contrôlée du champ
 * @param {Function} props.onChange - Callback au changement de valeur
 * @param {string} [props.tooltip] - Texte d'aide affiché au survol/focus de l'icône info
 * @returns {JSX.Element}
 */
export default function InputLabel({ nameId, content, type, isRequired, placeholder, value, onChange, tooltip }) {
  const inputRef = useRef(null);
  const isDate = type === 'date';
  const isArea = type === 'textarea';
  const Tag = isArea ? 'textarea' : 'input';

  const inputProps = isArea ? {} : { type };

  return (
    <div className={`${styles.label} ${isArea ? styles.area : ""}`}>
      <div className={styles.titleRow}>
        <label htmlFor={nameId} className={styles.title}>{content}</label>
        {tooltip && (
          <span
            className={styles.tooltipWrapper}
            tabIndex={0}
            role="button"
            aria-describedby={`${nameId}-tooltip`}
          >
            <span className={styles.tooltipIcon} aria-hidden="true">ⓘ</span>
            <span id={`${nameId}-tooltip`} role="tooltip" className={styles.tooltipContent}>
              {tooltip}
            </span>
          </span>
        )}
      </div>

      <div className={`${styles.inputWrapper} ${isArea ? styles.area : ""}`}>
        <Tag
          ref={inputRef}
          id={nameId}
          name={nameId}
          {...inputProps}
          className={`${styles.input} ${isDate ? styles.dateInput : ''} ${isArea ? styles.area : ""}`}
          required={isRequired}
          placeholder={placeholder}
          defaultValue={value ?? ''}
          onChange={onChange}
        />

        {isDate && (
          <button
            type="button"
            className={styles.calendarIcon}
            onClick={() => inputRef.current?.showPicker?.()}
            tabIndex={-1}
            aria-label="Ouvrir le calendrier"
          >
            <Image
              src={`/images/Calendar.svg`}
              alt={`Calendar`}
              width={12}
              height={12}
              loading="eager"
            />
          </button>
        )}
      </div>
    </div>
  );
}