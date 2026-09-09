import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
// Ajuste le chemin d'import selon l'emplacement réel du fichier
import FavoritesProvider, { useFavorites } from "./FavoritesContext";
import {
  addFavoriteAction,
  removeFavoriteAction,
  getFavoritesForUserAction,
} from "@/actions/favoritesActions";

vi.mock("@/actions/favoritesActions", () => ({
  addFavoriteAction: vi.fn(),
  removeFavoriteAction: vi.fn(),
  getFavoritesForUserAction: vi.fn(),
}));

const wrapper = (initialFavorites) => ({ children }) => (
  <FavoritesProvider initialFavorites={initialFavorites}>{children}</FavoritesProvider>
);

describe("useFavorites", () => {
  it("lève une erreur si utilisé hors FavoritesProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useFavorites())).toThrow(
      "useFavorites doit être utilisé dans un FavoritesProvider"
    );
    spy.mockRestore();
  });
});

describe("FavoritesProvider", () => {
  beforeEach(() => {
    addFavoriteAction.mockReset();
    removeFavoriteAction.mockReset();
    getFavoritesForUserAction.mockReset();
  });

  it("initialise favorites avec initialFavorites", () => {
    const initialFavorites = [{ id: "1" }, { id: "2" }];
    const { result } = renderHook(() => useFavorites(), {
      wrapper: wrapper(initialFavorites),
    });
    expect(result.current.favorites).toEqual(initialFavorites);
  });

  it("favorites est vide par défaut", () => {
    const { result } = renderHook(() => useFavorites(), { wrapper: wrapper(undefined) });
    expect(result.current.favorites).toEqual([]);
  });

  // --- addFavorite ---

  it("addFavorite ajoute le favori retourné à la liste locale", async () => {
    const newFavorite = { id: "3", propertyId: "42" };
    addFavoriteAction.mockResolvedValue(newFavorite);

    const { result } = renderHook(() => useFavorites(), {
      wrapper: wrapper([{ id: "1" }]),
    });

    await act(async () => {
      await result.current.addFavorite("42");
    });

    expect(addFavoriteAction).toHaveBeenCalledWith("42");
    expect(result.current.favorites).toEqual([{ id: "1" }, newFavorite]);
    expect(result.current.loading).toBe(false);
  });

  it("addFavorite stocke l'erreur, la relance, et ne modifie pas la liste", async () => {
    addFavoriteAction.mockRejectedValue(new Error("403 Forbidden"));

    const { result } = renderHook(() => useFavorites(), {
      wrapper: wrapper([{ id: "1" }]),
    });

    await act(async () => {
      await expect(result.current.addFavorite("42")).rejects.toThrow("403 Forbidden");
    });

    expect(result.current.error).toBe("403 Forbidden");
    expect(result.current.favorites).toEqual([{ id: "1" }]);
    expect(result.current.loading).toBe(false);
  });

  // --- removeFavorite ---

  it("removeFavorite retire le logement correspondant de la liste locale", async () => {
    removeFavoriteAction.mockResolvedValue();

    const { result } = renderHook(() => useFavorites(), {
      wrapper: wrapper([{ id: "1" }, { id: "2" }]),
    });

    await act(async () => {
      await result.current.removeFavorite("1");
    });

    expect(removeFavoriteAction).toHaveBeenCalledWith("1");
    expect(result.current.favorites).toEqual([{ id: "2" }]);
  });

  it("removeFavorite stocke l'erreur, la relance, et ne modifie pas la liste", async () => {
    removeFavoriteAction.mockRejectedValue(new Error("404 Not Found"));

    const { result } = renderHook(() => useFavorites(), {
      wrapper: wrapper([{ id: "1" }]),
    });

    await act(async () => {
      await expect(result.current.removeFavorite("1")).rejects.toThrow("404 Not Found");
    });

    expect(result.current.error).toBe("404 Not Found");
    expect(result.current.favorites).toEqual([{ id: "1" }]);
  });

  // --- fetchFavoritesByUserId ---

  it("fetchFavoritesByUserId retourne les favoris de l'utilisateur demandé", async () => {
    const remoteFavorites = [{ id: "9" }];
    getFavoritesForUserAction.mockResolvedValue(remoteFavorites);

    const { result } = renderHook(() => useFavorites(), { wrapper: wrapper([]) });

    let returned;
    await act(async () => {
      returned = await result.current.fetchFavoritesByUserId("user-99");
    });

    expect(getFavoritesForUserAction).toHaveBeenCalledWith("user-99");
    expect(returned).toEqual(remoteFavorites);
  });

  it("fetchFavoritesByUserId ne modifie PAS la liste locale de favoris (comportement actuel)", async () => {
    // ⚠️ La fonction ne fait pas de setFavorites : ce test documente ce
    // comportement, à confirmer que c'est bien voulu (voir remarque ci-dessous).
    getFavoritesForUserAction.mockResolvedValue([{ id: "9" }]);

    const { result } = renderHook(() => useFavorites(), {
      wrapper: wrapper([{ id: "1" }]),
    });

    await act(async () => {
      await result.current.fetchFavoritesByUserId("user-99");
    });

    expect(result.current.favorites).toEqual([{ id: "1" }]);
  });

  it("fetchFavoritesByUserId stocke l'erreur et la relance en cas d'échec", async () => {
    getFavoritesForUserAction.mockRejectedValue(new Error("Erreur réseau"));

    const { result } = renderHook(() => useFavorites(), { wrapper: wrapper([]) });

    await act(async () => {
      await expect(result.current.fetchFavoritesByUserId("user-99")).rejects.toThrow(
        "Erreur réseau"
      );
    });

    expect(result.current.error).toBe("Erreur réseau");
  });
});