async function login() {
  const codigo = document.getElementById("codigo").value.trim();
  const senha = document.getElementById("senha").value;
  const erro = document.getElementById("erro");
  erro.innerText = "";

  if (!codigo || !senha) {
    erro.innerText = "Preencha usuário e senha";
    return;
  }

  try {
    const res = await fetch("/api/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigo, senha })
    });

    const data = await res.json();

    if (data.codigo) {
      localStorage.setItem("usuario", JSON.stringify(data));
      window.location.href = "dashboard.html";
    } else {
      erro.innerText = data.erro || "Usuário ou senha inválidos";
    }
  } catch (e) {
    erro.innerText = "Não foi possível conectar ao servidor. Tente de novo.";
  }
}

document.querySelectorAll("#codigo, #senha").forEach(campo => {
  campo.addEventListener("keydown", e => {
    if (e.key === "Enter") login();
  });
});
