// API_URL n'a plus besoin du préfixe NEXT_PUBLIC_ : client.js ne tourne
// plus que côté serveur (Server Actions / Server Components).
const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
};

export default config;
