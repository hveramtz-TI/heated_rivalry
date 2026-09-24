/**
 * Single shared Spanish missing-content label (content-models spec).
 *
 * Every empty content slot — character card art/bio, episode fields, book
 * cover/metadata, selector option, rail and catalog empty states — consumes
 * this one constant. Components MUST NOT duplicate the wording and MUST NOT
 * render lorem, English placeholder copy, or fabricated facts in its place.
 * This file is the only occurrence of the literal repo-wide.
 */
export const MISSING_CONTENT_LABEL = "Contenido próximamente";
