const dns = require('dns');

async function normalizeMongoUri(uri) {
  if (!uri || !uri.startsWith('mongodb+srv://')) {
    return uri;
  }

  const resolver = new dns.promises.Resolver();
  resolver.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

  const parsed = new URL(uri);
  const srvRecords = await resolver.resolveSrv(`_mongodb._tcp.${parsed.hostname}`);
  const hosts = srvRecords
    .sort((a, b) => a.priority - b.priority || a.weight - b.weight)
    .map((record) => `${record.name}:${record.port}`)
    .join(',');

  parsed.searchParams.set('tls', parsed.searchParams.get('tls') || 'true');
  parsed.searchParams.set('authSource', parsed.searchParams.get('authSource') || 'admin');

  const auth = parsed.username
    ? `${parsed.username}${parsed.password ? `:${parsed.password}` : ''}@`
    : '';

  return `mongodb://${auth}${hosts}${parsed.pathname}?${parsed.searchParams.toString()}`;
}

module.exports = { normalizeMongoUri };
