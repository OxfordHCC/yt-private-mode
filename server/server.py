import http.server
import socketserver

class YouTuber(socketserver.BaseRequestHandler):
    def handle(self):
        # get full request url
        url = str(self.request.recv(1024).strip().splitlines()[0]).split(" ")[1]

        if not url.startswith("/?v="):
            print("Invalid url: " + url)
            self.response("Please provide video id.")
            return

        # get video id from url
        vid = url[4:]
        print("Processing vid: " + vid)

        # TODO: Add logic to remove video id from watch history. Only remove videos, if they hadn't been previously on the list!!

        # send response
        self.response("Removed video id from history: " + vid)

    def response(self, msg):
        self.request.sendall(str.encode("HTTP/1.1 200 OK\n\n" + msg))

if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True # Prevent 'cannot bind to address' errors on restart

    HOST, PORT = "localhost", 8080

    print("Server running at port " + str(PORT))

    with socketserver.TCPServer((HOST, PORT), YouTuber) as server:
        server.serve_forever()