import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
// Ajuste le chemin d'import selon l'emplacement réel du fichier
import { AuthProvider, useAuth } from "./AuthContext";
import { getUserByIdAction, updateUserAction } from "@/actions/usersActions";

vi.mock("@/actions/usersActions", () => ({
  getUserByIdAction: vi.fn(),
  updateUserAction: vi.fn(),
}));

const wrapper = (initialUser) => ({ children }) => (
  <AuthProvider initialUser={initialUser}>{children}</AuthProvider>
);

describe("useAuth", () => {
  it("lève une erreur si utilisé hors AuthProvider", () => {
    // useContext renvoie null hors provider -> le hook throw ; on masque
    // le console.error que React émet pour cette erreur non catchée par un boundary
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider"
    );
    spy.mockRestore();
  });
});

describe("AuthProvider", () => {
  beforeEach(() => {
    getUserByIdAction.mockReset();
    updateUserAction.mockReset();
  });

  it("initialise user avec initialUser", () => {
    const initialUser = { id: "1", role: "client" };
    const { result } = renderHook(() => useAuth(), { wrapper: wrapper(initialUser) });
    expect(result.current.user).toEqual(initialUser);
  });

  it("isAdmin vaut true seulement si role === 'admin'", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: wrapper({ id: "1", role: "admin" }),
    });
    expect(result.current.isAdmin).toBe(true);
  });

  it("isAdmin vaut false pour un role différent", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: wrapper({ id: "1", role: "client" }),
    });
    expect(result.current.isAdmin).toBe(false);
  });

  // --- refreshProfile ---

  it("refreshProfile ne fait rien et retourne null si aucun utilisateur courant", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: wrapper(null) });

    let returned;
    await act(async () => {
      returned = await result.current.refreshProfile();
    });

    expect(returned).toBeNull();
    expect(getUserByIdAction).not.toHaveBeenCalled();
  });

  it("refreshProfile recharge et met à jour l'utilisateur", async () => {
    const initialUser = { id: "1", role: "client", name: "Alice" };
    const updatedUser = { id: "1", role: "client", name: "Alice Updated" };
    getUserByIdAction.mockResolvedValue({ data: { user: updatedUser } });

    const { result } = renderHook(() => useAuth(), { wrapper: wrapper(initialUser) });

    let returned;
    await act(async () => {
      returned = await result.current.refreshProfile();
    });

    expect(getUserByIdAction).toHaveBeenCalledWith("1");
    expect(returned).toEqual(updatedUser);
    expect(result.current.user).toEqual(updatedUser);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("refreshProfile passe loading à true pendant l'appel puis false", async () => {
    let resolvePromise;
    getUserByIdAction.mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve;
      })
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: wrapper({ id: "1", role: "client" }),
    });

    let promise;
    act(() => {
      promise = result.current.refreshProfile();
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolvePromise({ data: { user: { id: "1", role: "client" } } });
      await promise;
    });

    expect(result.current.loading).toBe(false);
  });

  it("refreshProfile stocke l'erreur, la relance, et repasse loading à false", async () => {
    getUserByIdAction.mockRejectedValue(new Error("Utilisateur introuvable"));

    const { result } = renderHook(() => useAuth(), {
      wrapper: wrapper({ id: "1", role: "client" }),
    });

    await act(async () => {
      await expect(result.current.refreshProfile()).rejects.toThrow(
        "Utilisateur introuvable"
      );
    });

    expect(result.current.error).toBe("Utilisateur introuvable");
    expect(result.current.loading).toBe(false);
  });

  // --- editProfile ---

  it("editProfile met à jour l'utilisateur avec les nouvelles données", async () => {
    const initialUser = { id: "1", role: "client", name: "Alice" };
    const updatedUser = { id: "1", role: "client", name: "Alice B." };
    updateUserAction.mockResolvedValue({ data: { user: updatedUser } });

    const { result } = renderHook(() => useAuth(), { wrapper: wrapper(initialUser) });

    let returned;
    await act(async () => {
      returned = await result.current.editProfile({ name: "Alice B." });
    });

    expect(updateUserAction).toHaveBeenCalledWith("1", { name: "Alice B." });
    expect(returned).toEqual(updatedUser);
    expect(result.current.user).toEqual(updatedUser);
  });

  // --- clearUser / setUser ---

  it("clearUser réinitialise l'utilisateur à null", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: wrapper({ id: "1", role: "client" }),
    });

    act(() => {
      result.current.clearUser();
    });

    expect(result.current.user).toBeNull();
  });

  it("setUser permet de définir directement l'utilisateur courant", () => {
    const { result } = renderHook(() => useAuth(), { wrapper: wrapper(null) });
    const newUser = { id: "2", role: "owner" };

    act(() => {
      result.current.setUser(newUser);
    });

    expect(result.current.user).toEqual(newUser);
    expect(result.current.isAdmin).toBe(false);
  });
});