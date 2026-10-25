const http = require('http');

let data = {
  students: [],
  teachers: [],
  attendance: [],
  marks: []
};

let ids = {
  students: 1,
  teachers: 1,
  attendance: 1,
  marks: 1
};

const server = http.createServer(async (req, res) => {
  const send = (status, result) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  };

  // Safely parse URL and ignore query parameters
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const parts = parsedUrl.pathname.split('/').filter(Boolean);
  const resource = parts[0];
  const id = parts[1] ? Number(parts[1]) : null;

  if (!resource || !data[resource]) {
    return send(404, { error: 'Invalid or missing endpoint' });
  }

  let body = {};

  if (['POST', 'PUT'].includes(req.method)) {
    try {
      let text = '';
      for await (const chunk of req) {
        text += chunk;
        if (Buffer.byteLength(text) > 65536) return send(413, { error: 'Payload too large' });
      }
      body = JSON.parse(text || '{}');
    } catch (error) {
      if (error instanceof SyntaxError) return send(400, { error: 'Invalid JSON' });
      return send(500, { error: 'Server error' });
    }
  }

  // GET: Read all or one item
  if (req.method === 'GET') {
    if (id === null) return send(200, data[resource]);
    const item = data[resource].find(x => x.id === id);
    return item ? send(200, item) : send(404, { error: 'Item not found' });
  }

  // POST: Add new item
  if (req.method === 'POST') {
    if (id !== null) return send(400, { error: 'Cannot POST to a specific ID' });
    const item = { id: ids[resource]++, ...body };
    data[resource].push(item);
    return send(201, item);
  }

  // PUT: Update item
  if (req.method === 'PUT') {
    if (id === null) return send(400, { error: 'ID required for update' });
    const index = data[resource].findIndex(x => x.id === id);
    if (index === -1) return send(404, { error: 'Item not found' });

    data[resource][index] = { ...data[resource][index], ...body, id };
    return send(200, data[resource][index]);
  }

  // DELETE: Remove item
  if (req.method === 'DELETE') {
    if (id === null) return send(400, { error: 'ID required for deletion' });
    const index = data[resource].findIndex(x => x.id === id);
    if (index === -1) return send(404, { error: 'Item not found' });

    const deleted = data[resource].splice(index, 1);
    return send(200, { message: 'Deleted successfully', deleted: deleted[0] });
  }

  return send(405, { error: 'Method not allowed' });
});

server.listen(3004, () => {
  console.log('Student Management API running at http://localhost:3004');
});