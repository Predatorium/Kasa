import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, beforeEach, vi } from "vitest";
import Carrousel from "./index";

// Mock du CSS module : les classes deviennent des chaînes prévisibles
vi.mock("./Carrousel.module.css", () => ({
  default: {
    wrapper: "wrapper",
    caroussel: "caroussel",
    picture: "picture",
    pictureBig: "pictureBig",
    arrow: "arrow",
    left: "left",
    right: "right",
  },
}));

// Mock next/image : rendu simplifié en <img>
vi.mock("next/image", () => ({
  default: (props) => <img alt={props.alt} src={props.src} />,
}));

const makePictures = (count) =>
  Array.from({ length: count }, (_, i) => `/images/photo-${i}.jpg`);

describe("Carrousel", () => {
  let onClick;
  let setIndex;

  beforeEach(() => {
    onClick = vi.fn();
    setIndex = vi.fn();

    // jsdom n'implémente pas scrollBy : simulation sur le prototype
    Element.prototype.scrollBy = vi.fn();
  });

  it("affiche une image par photo fournie", () => {
    const pictures = makePictures(3);

    render(
      <Carrousel
        pictures={pictures}
        onClick={onClick}
        setIndex={setIndex}
      />
    );

    expect(screen.getAllByAltText("Couverture")).toHaveLength(3);
  });

  it("n'affiche pas les flèches quand il y a 5 photos ou moins", () => {
    const pictures = makePictures(5);

    render(
      <Carrousel
        pictures={pictures}
        onClick={onClick}
        setIndex={setIndex}
      />
    );

    expect(screen.queryByText("‹")).not.toBeInTheDocument();
    expect(screen.queryByText("›")).not.toBeInTheDocument();
  });

  it("affiche les flèches quand il y a plus de 5 photos", () => {
    const pictures = makePictures(6);

    render(
      <Carrousel
        pictures={pictures}
        onClick={onClick}
        setIndex={setIndex}
      />
    );

    expect(screen.getByText("‹")).toBeInTheDocument();
    expect(screen.getByText("›")).toBeInTheDocument();
  });

  it("appelle onClick(true) et setIndex(index) au clic sur une photo", () => {
    const pictures = makePictures(3);

    render(
      <Carrousel
        pictures={pictures}
        onClick={onClick}
        setIndex={setIndex}
      />
    );

    const images = screen.getAllByAltText("Couverture");

    fireEvent.click(images[2].parentElement);

    expect(onClick).toHaveBeenCalledWith(true);
    expect(setIndex).toHaveBeenCalledWith(2);
  });

  it("fait défiler vers la droite au clic sur la flèche droite", () => {
    const pictures = makePictures(6);

    const { container } = render(
      <Carrousel
        pictures={pictures}
        onClick={onClick}
        setIndex={setIndex}
      />
    );

    const track = container.querySelector(".caroussel");

    Object.defineProperty(track, "clientWidth", {
      value: 1000,
      configurable: true,
    });

    fireEvent.click(screen.getByText("›"));

    expect(track.scrollBy).toHaveBeenCalledWith({
      left: 250,
      behavior: "smooth",
    });
  });

  it("fait défiler vers la gauche au clic sur la flèche gauche", () => {
    const pictures = makePictures(6);

    const { container } = render(
      <Carrousel
        pictures={pictures}
        onClick={onClick}
        setIndex={setIndex}
      />
    );

    const track = container.querySelector(".caroussel");

    Object.defineProperty(track, "clientWidth", {
      value: 1000,
      configurable: true,
    });

    fireEvent.click(screen.getByText("‹"));

    expect(track.scrollBy).toHaveBeenCalledWith({
      left: -250,
      behavior: "smooth",
    });
  });

  it("applique la classe pictureBig uniquement à la première photo", () => {
    const pictures = makePictures(3);

    const { container } = render(
      <Carrousel
        pictures={pictures}
        onClick={onClick}
        setIndex={setIndex}
      />
    );

    const items = container.querySelectorAll(".picture");

    expect(items[0]).toHaveClass("pictureBig");
    expect(items[1]).not.toHaveClass("pictureBig");
  });
});