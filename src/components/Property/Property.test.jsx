import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, beforeEach, vi } from "vitest";
import PropertyCard from "./index";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";

// Mock du CSS module : les classes deviennent des chaînes prévisibles
vi.mock("./Property.module.css", () => ({
  default: {
    card: "card",
    button: "button",
    favorite: "favorite",
    notFav: "notFav",
    link: "link",
    head: "head",
    cover: "cover",
    infos: "infos",
    top: "top",
    title: "title",
    location: "location",
    rate: "rate",
    price: "price",
  },
}));

// Mock next/image : rendu simplifié en <img>
vi.mock("next/image", () => ({
  default: (props) => <img alt={props.alt} src={props.src} />,
}));

// Mock next/link : rendu simplifié en <a>
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

// Mock next/navigation : redirect espionnable
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

// Mock des contextes
vi.mock("@/contexts/FavoritesContext", () => ({
  useFavorites: vi.fn(),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

const property = {
  id: "42",
  title: "Bel appartement",
  location: "Paris, France",
  cover: "/images/appart.jpg",
  price_per_night: 120,
};

describe("PropertyCard", () => {
  let addFavorite;
  let removeFavorite;

  beforeEach(() => {
    addFavorite = vi.fn();
    removeFavorite = vi.fn();
    useFavorites.mockReturnValue({ addFavorite, removeFavorite });
    useAuth.mockReturnValue({ user: { id: "1", role: "tenant" } });
    redirect.mockClear();
  });

  it("affiche le titre, la localisation et le prix", () => {
    render(<PropertyCard property={property} inFavorite={false} />);

    expect(screen.getByText("Bel appartement")).toBeInTheDocument();
    expect(screen.getByText("Paris, France")).toBeInTheDocument();
    expect(screen.getByText("120€")).toBeInTheDocument();
  });

  it("pointe vers la bonne page de détail", () => {
    render(<PropertyCard property={property} inFavorite={false} />);

    expect(screen.getByRole("link")).toHaveAttribute("href", "/property/42");
  });

  it("affiche l'icône favori vide quand inFavorite est false", () => {
    render(<PropertyCard property={property} inFavorite={false} />);

    expect(screen.getByAltText("Icon Favoris")).toHaveAttribute(
      "src",
      "/images/Favoris.svg"
    );
  });

  it("affiche l'icône favori pleine quand inFavorite est true", () => {
    render(<PropertyCard property={property} inFavorite={true} />);

    expect(screen.getByAltText("Icon Favoris")).toHaveAttribute(
      "src",
      "/images/Favoris_fav.svg"
    );
  });

  // --- Ajout / retrait des favoris ---

  it("ajoute le logement aux favoris au clic si utilisateur connecté et pas encore favori", () => {
    render(<PropertyCard property={property} inFavorite={false} />);

    fireEvent.click(screen.getByRole("button"));

    expect(addFavorite).toHaveBeenCalledTimes(1);
    expect(addFavorite).toHaveBeenCalledWith("42");
    expect(removeFavorite).not.toHaveBeenCalled();
  });

  it("met à jour l'icône après l'ajout aux favoris (passe en état 'favori')", () => {
    render(<PropertyCard property={property} inFavorite={false} />);
    const button = screen.getByRole("button");

    // Avant le clic : icône vide, classe notFav présente
    expect(screen.getByAltText("Icon Favoris")).toHaveAttribute(
      "src",
      "/images/Favoris.svg"
    );
    expect(button).toHaveClass("notFav");

    fireEvent.click(button);

    // Après le clic : icône pleine, classe notFav retirée
    expect(screen.getByAltText("Icon Favoris")).toHaveAttribute(
      "src",
      "/images/Favoris_fav.svg"
    );
    expect(button).not.toHaveClass("notFav");
  });

  it("retire le logement des favoris au clic si utilisateur connecté et déjà favori", () => {
    render(<PropertyCard property={property} inFavorite={true} />);

    fireEvent.click(screen.getByRole("button"));

    expect(removeFavorite).toHaveBeenCalledTimes(1);
    expect(removeFavorite).toHaveBeenCalledWith("42");
    expect(addFavorite).not.toHaveBeenCalled();
  });

  it("redirige vers /login sans toucher aux favoris si utilisateur non connecté", () => {
    useAuth.mockReturnValue({ user: null });
    render(<PropertyCard property={property} inFavorite={false} />);

    fireEvent.click(screen.getByRole("button"));

    expect(redirect).toHaveBeenCalledWith("/login");
    expect(addFavorite).not.toHaveBeenCalled();
    expect(removeFavorite).not.toHaveBeenCalled();
  });

  it("gère les propriétés manquantes sans planter", () => {
    render(<PropertyCard property={{ id: "1" }} inFavorite={false} />);

    expect(screen.getByAltText("Couverture")).toBeInTheDocument();
  });
});