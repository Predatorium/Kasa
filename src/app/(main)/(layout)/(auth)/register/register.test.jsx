import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, beforeEach, vi } from "vitest";
// Ajuste le chemin d'import selon l'emplacement réel du fichier
import RegisterPage from "./page";
import Register from "./action";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

vi.mock("./register.module.css", () => ({
  default: {
    page: "page",
    register: "register",
    head: "head",
    title: "title",
    subsection: "subsection",
    error: "error",
    form: "form",
    wrapperRole: "wrapperRole",
    labelRole: "labelRole",
    role: "role",
    actions: "actions",
  },
}));

vi.mock("./action", () => ({
  default: vi.fn(),
}));

// ⚠️ Adapte le mock d'InputLabel si son implémentation réelle diffère
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

describe("RegisterPage", () => {
  let setUser;
  let push;

  beforeEach(() => {
    setUser = vi.fn();
    push = vi.fn();
    useAuth.mockReturnValue({ setUser });
    useRouter.mockReturnValue({ push });
    Register.mockReset();
  });

  it("affiche tous les champs du formulaire", () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText("Nom")).toBeInTheDocument();
    expect(screen.getByLabelText("Prénom")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Mot de passe")).toBeInTheDocument();
    expect(screen.getByLabelText("Role :")).toBeInTheDocument();
  });

  it("propose 'client' comme rôle par défaut", () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText("Role :")).toHaveValue("client");
  });

  it("affiche le lien vers la connexion", () => {
    render(<RegisterPage />);
    expect(screen.getByText("Déjà membre ? Se connecter")).toHaveAttribute(
      "href",
      "/login"
    );
  });

  it("inscrit l'utilisateur et redirige vers / en cas de succès", async () => {
    const user = userEvent.setup();
    const newUser = { id: "1", role: "owner" };
    Register.mockResolvedValue({ success: true, user: newUser });

    render(<RegisterPage />);

    await user.type(screen.getByLabelText("Nom"), "Dupont");
    await user.type(screen.getByLabelText("Prénom"), "Jean");
    await user.type(screen.getByLabelText("Email"), "jean@test.com");
    await user.type(screen.getByLabelText("Mot de passe"), "password123");
    await user.selectOptions(screen.getByLabelText("Role :"), "owner");
    await user.click(screen.getByRole("button", { name: "S’inscrire" }));

    await waitFor(() => {
      expect(Register).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(setUser).toHaveBeenCalledWith(newUser);
      expect(push).toHaveBeenCalledWith("/");
    });
  });

  it("affiche le message d'erreur et n'inscrit pas l'utilisateur en cas d'échec", async () => {
    const user = userEvent.setup();
    Register.mockResolvedValue({ success: false, error: "Email déjà utilisé" });

    render(<RegisterPage />);

    await user.type(screen.getByLabelText("Nom"), "Dupont");
    await user.type(screen.getByLabelText("Prénom"), "Jean");
    await user.type(screen.getByLabelText("Email"), "jean@test.com");
    await user.type(screen.getByLabelText("Mot de passe"), "password123");
    await user.click(screen.getByRole("button", { name: "S’inscrire" }));

    expect(await screen.findByText("Email déjà utilisé")).toBeInTheDocument();
    expect(setUser).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });
});