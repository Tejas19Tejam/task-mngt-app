import app from "./app";

const PORT = parseInt(process.env.PORT || "4000", 10);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
