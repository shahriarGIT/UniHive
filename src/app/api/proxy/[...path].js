// pages/api/proxy/[...path].js

// export default async function handler(req, res) {
//   const backendUrl = `http://localhost:3001/${req.query.path.join("/")}`;

//   const response = await fetch(backendUrl, {
//     method: req.method,
//     headers: {
//       ...req.headers,
//       host: "localhost:3001", // override if needed
//     },
//     body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
//   });

//   const data = await response.text(); // can be JSON or text
//   res.status(response.status).send(data);
// }
