"""Range-aware static server for local preview.

`python -m http.server` honors Range requests but doesn't advertise
`Accept-Ranges: bytes`, so Chrome treats the videos as non-seekable
and rejects every `video.currentTime = X` write — breaking the
scroll-scrubbed videos. Run this instead.

  python serve.py            # http://127.0.0.1:8765
  python serve.py 8080       # custom port
"""
import http.server, socketserver, sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8765

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
    print(f"Serving http://127.0.0.1:{PORT}/", flush=True)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
