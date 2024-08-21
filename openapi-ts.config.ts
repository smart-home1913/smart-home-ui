import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "http://smart_home_backend:8000/openapi.json",
  output: "src/client",
  base: "http://smart_home_backend:8000",
  services: {
    asClass: true,
  },
});
