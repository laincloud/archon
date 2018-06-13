package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"path"
	"strings"
)

func main() {
	var port int
	var staticDir string
	flag.IntVar(&port, "port", 8080, "The port to listen")
	flag.StringVar(&staticDir, "staticdir", "", "Static files directory")
	flag.Parse()

	if staticDir == "" {
		log.Fatal("-staticdir is required")
	}

	fs := http.FileServer(http.Dir(staticDir))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, "/assets") {
			fs.ServeHTTP(w, r)
		} else {
			http.ServeFile(w, r, path.Join(staticDir, "index.html"))
		}
	})
	log.Printf("Listening to :%d, staticDir: %s...", port, staticDir)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))
}
