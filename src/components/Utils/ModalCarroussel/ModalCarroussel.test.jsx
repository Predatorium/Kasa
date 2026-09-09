import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import ModalCarrousel from "./index";

// Mock next/image : on enlève les props spécifiques à Next incompatibles avec <img>
vi.mock("next/image", () => ({
  default: ({ fill, sizes, priority, quality, loader, ...props }) => (
    <img {...props} />
  ),
}));

const makePictures = (count) =>
  Array.from({ length: count }, (_, i) => `/images/photo-${i}.jpg`);

describe("ModalCarrousel", () => {
  let onClose;

  beforeEach(() => {
    onClose = vi.fn();

    // jsdom ne gère pas ces méthodes nativement
    Element.prototype.scrollBy = vi.fn();
    Element.prototype.scrollTo = vi.fn();

    // Valeur stable pour les calculs de défilement
    Object.defineProperty(Element.prototype, "clientWidth", {
      configurable: true,
      get: () => 800,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.style.overflow = "";
  });

  const renderModal = (props = {}) =>
    render(
      <ModalCarrousel
        pictures={makePictures(3)}
        startIndex={0}
        onClose={onClose}
        isOpen={true}
        {...props}
      />
    );

  // Le composant est la structure :
  // wrapper > caroussel > picture > img.
  // On remonte du premier <img> vers le div du carrousel.
  const getCarrousel = () => {
    const firstImage = screen.getAllByAltText("Couverture")[0];
    return firstImage.parentElement.parentElement;
  };

  const getWrapper = () => getCarrousel().parentElement;

  it("affiche une image par photo fournie", () => {
    renderModal({ pictures: makePictures(3) });

    expect(screen.getAllByAltText("Couverture")).toHaveLength(3);
  });

  it("affiche les flèches de navigation", () => {
    renderModal();

    expect(screen.getByRole("button", { name: "‹" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "›" })).toBeInTheDocument();
  });

  it("appelle onClose au clic sur le fond de la modale", () => {
    renderModal();

    fireEvent.click(getWrapper());

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("ne ferme pas la modale au clic sur une flèche", () => {
    renderModal();

    fireEvent.click(screen.getByRole("button", { name: "›" }));
    fireEvent.click(screen.getByRole("button", { name: "‹" }));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("défile vers la droite au clic sur la flèche droite", () => {
    renderModal({ startIndex: 0 });

    const carrousel = getCarrousel();
    fireEvent.click(screen.getByRole("button", { name: "›" }));

    expect(carrousel.scrollBy).toHaveBeenCalledWith({
      left: 800,
      behavior: "smooth",
    });
  });

  it("défile vers la gauche au clic sur la flèche gauche", () => {
    renderModal({ startIndex: 1 });

    const carrousel = getCarrousel();
    fireEvent.click(screen.getByRole("button", { name: "‹" }));

    expect(carrousel.scrollBy).toHaveBeenCalledWith({
      left: -800,
      behavior: "smooth",
    });
  });

  it("revient à la première photo après la dernière avec la flèche droite", () => {
    renderModal({
      pictures: makePictures(3),
      startIndex: 2,
    });

    const carrousel = getCarrousel();
    fireEvent.click(screen.getByRole("button", { name: "›" }));

    expect(carrousel.scrollBy).toHaveBeenCalledWith({
      left: -2400,
      behavior: "smooth",
    });
  });

  it("revient à la dernière photo avant la première avec la flèche gauche", () => {
    renderModal({
      pictures: makePictures(3),
      startIndex: 0,
    });

    const carrousel = getCarrousel();
    fireEvent.click(screen.getByRole("button", { name: "‹" }));

    expect(carrousel.scrollBy).toHaveBeenCalledWith({
      left: 2400,
      behavior: "smooth",
    });
  });

  it("appelle onClose avec la touche Échap lorsque la modale est ouverte", () => {
    renderModal({ isOpen: true });

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("bloque le défilement de la page tant que la modale est ouverte", () => {
    renderModal({ isOpen: true });

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("positionne le carrousel sur startIndex à l'ouverture", () => {
    renderModal({ startIndex: 2 });

    const carrousel = getCarrousel();

    expect(carrousel.scrollTo).toHaveBeenCalledWith(1600, 0);
  });
});