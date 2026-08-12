export default async function handler(req, res) {

  return res.status(200).json({
    owner: process.env.GITHUB_OWNER,
    repo: process.env.GITHUB_REPO,
    tokenExiste: !!process.env.GITHUB_TOKEN
  });

}
