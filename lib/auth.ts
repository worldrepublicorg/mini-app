export function checkWalletAuth() {
  if (typeof document === "undefined") return false; // Server-side safety
  return document.cookie.includes("wallet-auth=authenticated");
}

export function getWalletAddress() {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("wallet-address="))
    ?.split("=")[1];
}

export async function getUsername(address: string) {
  try {
    const res = await fetch(
      `https://usernames.worldcoin.org/api/v1/${address}`
    );
    if (!res.ok) throw new Error("Failed to fetch username");
    const data = await res.json();
    return data.username || "Anonymous";
  } catch (error) {
    console.error("Username fetch error:", error);
    return "Anonymous";
  }
}

export function getStoredUsername() {
  if (typeof document === "undefined") return null;
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("wallet-username="))
      ?.split("=")[1] || null
  );
}
