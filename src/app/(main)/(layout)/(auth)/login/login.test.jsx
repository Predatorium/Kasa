import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, beforeEach, vi } from "vitest";
// Ajuste le chemin d'import selon l'emplacement réel du fichier
import LoginPage from "./page";
import Login from "./action";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

// Mock du CSS module
vi.mock("./login.module.css", () => ({
  default: {
    page: "page",
    login: "login",
    head: "head",
    title: "title",
    subsection: "subsection",
    error: "error",
    form: "form",
    actions: "actions",
    links: "links",
  },
}));

// Mock de la Server Action : on contrôle sa résolution depuis chaque test
vi.mock("./action", () => ({
  default: vi.fn(),
}));

// Mocks des composants enfants — implémentation minimale mais fonctionnelle.
// ⚠️ Adapte le mock d'InputLabel si son implémentation réelle diffère
// (attribut name/id différent, wrapper différent, etc.)
vi.mock("@/components/Clickable/Link", () => ({
  default: ({ link, children }) => <a href={link}>{children}</a>,
}));

vi.mock("@/components/Utils/InputLabel", () => ({
  default: ({ type, nameId, content }) => (
    <label>
      {content}
      <input type={type} name={nameId} id={nameId} />
    </label>
  ),
}));

vi.mock("@/components/Clickable/Button", () => ({
  Button: ({ content, type }) => <button type={type}>{content}</button>,
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("LoginPage", () => {
  let setUser;
  let push;

  beforeEach(() => {
    setUser = vi.fn();
    push = vi.fn();
    useAuth.mockReturnValue({ setUser });
    useRouter.mockReturnValue({ push });
    Login.mockReset();
  });

  it("affiche les champs email et mot de passe", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Mot de passe")).toBeInTheDocument();
  });

  it("affiche les liens mot de passe oublié et inscription", () => {
    render(<LoginPage />);
    expect(screen.getByText("Mot de passe oublié")).toBeInTheDocument();
    expect(
      screen.getByText("Pas encore de compte ? Inscrivez-vous")
    ).toHaveAttribute("href", "/register");
  });

  it("n'affiche pas de message d'erreur initialement", () => {
    const { container } = render(<LoginPage />);
    expect(container.querySelector(".error")).not.toBeInTheDocument();
  });

  it("connecte l'utilisateur et redirige vers / en cas de succès", async () => {
    const user = userEvent.setup();
    const loggedInUser = { id: "1", role: "client" };
    Login.mockResolvedValue({ success: true, user: loggedInUser });

    render(<LoginPage />);

    await user.type(screen.getByLabelText("Email"), "alice@test.com");
    await user.type(screen.getByLabelText("Mot de passe"), "password123");
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    await waitFor(() => {
      expect(Login).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(setUser).toHaveBeenCalledWith(loggedInUser);
      expect(push).toHaveBeenCalledWith("/");
    });
  });

  it("affiche le message d'erreur et ne connecte pas l'utilisateur en cas d'échec", async () => {
    const user = userEvent.setup();
    Login.mockResolvedValue({ success: false, error: "Identifiants invalides" });

    render(<LoginPage />);

    await user.type(screen.getByLabelText("Email"), "alice@test.com");
    await user.type(screen.getByLabelText("Mot de passe"), "wrong");
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    expect(await screen.findByText("Identifiants invalides")).toBeInTheDocument();
    expect(setUser).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });
});