import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, beforeEach, vi } from "vitest";
import Add from "./page";

// Mock des CSS modules
vi.mock("./add.module.css", () => ({
  default: {
    page: "page",
    button: "button",
    add: "add",
    title: "title",
    error: "error",
    greatSection: "greatSection",
    section: "section",
    area: "area",
    parent: "parent",
    subSection: "subSection",
    equips: "equips",
    tagList: "tagList",
    empty: "empty",
  },
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ fill, sizes, priority, quality, loader, ...props }) => (
    <img {...props} />
  ),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock next/navigation
vi.mock("next/navigation", async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    }),
    redirect: vi.fn(),
  };
});

// Mock du contexte Auth
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "user-1", name: "Test User" },
  }),
}));

// Mock des composants custom
vi.mock("@/components/Clickable/Button", () => ({
  Button: ({ type, content }) => (
    <button type={type}>{content}</button>
  ),
}));

vi.mock("@/components/Utils/InputLabel", () => ({
  default: ({ type, nameId, content, placeholder }) => (
    <div data-testid={`input-${nameId}`}>
      <label>{content}</label>
      {type === "textarea" ? (
        <textarea name={nameId} placeholder={placeholder} />
      ) : (
        <input type={type} name={nameId} placeholder={placeholder} />
      )}
    </div>
  ),
}));

vi.mock("@/components/Utils/ImageLabel", () => ({
  default: ({
    nameId,
    name,
    content,
    icon,
    placeholder,
    value,
    onChange,
    onClick,
  }) => (
    <div data-testid={`imagelabel-${nameId}`}>
      <label>{content}</label>
      {placeholder ? (
        <input
          type="text"
          name={nameId}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onClick={onClick}
        />
      ) : (
        <input type="file" name={name} data-testid={`file-${nameId}`} />
      )}
      {icon && <span data-testid={`icon-${icon}`}>{icon}</span>}
    </div>
  ),
}));

vi.mock("@/components/Clickable/Link", () => ({
  KasaLinkButton: ({ children, onClick }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/Utils/CheckBox", () => ({
  default: ({ nameId, name, value, content }) => (
    <label data-testid={`checkbox-${nameId}`}>
      <input type="checkbox" name={name} value={value} />
      {content}
    </label>
  ),
}));

vi.mock("@/components/Utils/Tag", () => ({
  default: ({ text, onClick }) => (
    <button type="button" onClick={onClick}>
      {text}
    </button>
  ),
}));

// Mock de l'action serveur
vi.mock("./action", () => ({
  default: vi.fn(),
}));

describe("Add (page de création de logement)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche le titre de la page", () => {
    render(<Add />);

    expect(
      screen.getByRole("heading", { level: 1 })
    ).toHaveTextContent("Ajouter une propriété");
  });

  it("affiche un bouton de retour vers l'accueil", () => {
    render(<Add />);

    const backLink = screen.getByRole("link", { name: /retour/i });
    expect(backLink).toHaveAttribute("href", "/");
  });

  it("affiche un bouton de soumission du formulaire", () => {
    render(<Add />);

    expect(
      screen.getByRole("button", { name: "Ajouter" })
    ).toHaveAttribute("type", "submit");
  });

  it("affiche tous les champs de saisie principaux", () => {
    render(<Add />);

    const fields = [
      "Titre de la propriété",
      "Description",
      "Code postal",
      "Localisation",
      "Prix pour la nuit",
      /nom de l.hôte/i, // ← regex insensible au type d'apostrophe
    ];

    fields.forEach((labelText) => {
      expect(screen.getByText(labelText)).toBeInTheDocument();
    });
  });

  it("affiche un champ pour l'image de couverture", () => {
    render(<Add />);

    expect(screen.getByText("Image de couverture")).toBeInTheDocument();
    expect(screen.getByTestId("file-Cover")).toBeInTheDocument();
  });

  it("affiche au moins un champ pour les images du logement", () => {
    render(<Add />);

    expect(screen.getByText("Image du logement")).toBeInTheDocument();
    expect(
      screen.getByTestId(/file-propertyPicture-.*$/i)
    ).toBeInTheDocument();
  });

  it("affiche un champ pour la photo de profil de l'hôte", () => {
    render(<Add />);

    expect(screen.getByText("Photo de profil")).toBeInTheDocument();
    expect(screen.getByTestId("file-hostPicture")).toBeInTheDocument();
  });

  it("affiche la section Équipements avec des cases à cocher", () => {
    render(<Add />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Équipements" })
    ).toBeInTheDocument();

    const equipments = [
      "Micro-Ondes",
      "Frigo",
      "WIFI",
      "Lit",
      "Parking",
      "Cuisine équipée",
    ];

    equipments.forEach((equip) => {
      expect(screen.getByText(equip)).toBeInTheDocument();
    });
  });

  it("affiche la section Catégories avec la liste des tags", () => {
    render(<Add />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Catégories" })
    ).toBeInTheDocument();
    expect(screen.getByText("Aucune tag ajouter")).toBeInTheDocument();
  });

  it("affiche un champ pour ajouter une catégorie personnalisée", () => {
    render(<Add />);

    expect(
      screen.getByText("Ajouter une catégorie personnalisée")
    ).toBeInTheDocument();
  });

  it("permet d'ajouter un tag personnalisé", () => {
    render(<Add />);

    const input = screen.getByPlaceholderText("Nouveau tag");

    fireEvent.change(input, { target: { value: "Vue mer" } });
    fireEvent.click(input);

    expect(screen.queryByText("Aucune tag ajouter")).not.toBeInTheDocument();
    expect(screen.getByText("Vue mer")).toBeInTheDocument();
  });

  it("permet d'ajouter un nouveau champ image du logement", () => {
    render(<Add />);

    const initialCount = screen.getAllByText("Image du logement").length;

    const addButton = screen.getByRole("button", {
      name: "+Ajouter une image",
    });
    fireEvent.click(addButton);

    const newCount = screen.getAllByText("Image du logement").length;
    expect(newCount).toBeGreaterThan(initialCount);
  });

  it("n'affiche pas de message d'erreur par défaut", () => {
    render(<Add />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});