export default async function handler(req, res) {

  if (req.method !== "POST") {

    return res.status(405).json({
      success: false,
      error: "Método no permitido"
    });
  }

  try {

    const owner =
      process.env.GITHUB_OWNER;

    const repo =
      process.env.GITHUB_REPO;

    const token =
      process.env.GITHUB_TOKEN;

    const { pdf } = req.body;

    if (!pdf) {

      return res.status(400).json({
        success: false,
        error: "No se recibió PDF"
      });
    }

    // Obtener SHA actual

    const currentFileResponse =
      await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/presentacion.pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json"
          }
        }
      );

    const currentFile =
      await currentFileResponse.json();

    const sha =
      currentFile.sha;

    // Reemplazar PDF

    const updateResponse =
      await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/presentacion.pdf`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: "Actualizar presentación",
            content: pdf,
            sha
          })
        }
      );

    const result =
      await updateResponse.json();

    if (!updateResponse.ok) {

      return res.status(500).json({
        success: false,
        error: result.message
      });
    }

    return res.status(200).json({
      success: true
    });

  }
  catch (error) {

    return res.status(500).json({
      success: false,
      error: error.message
    });

  }

}
