package principia

import (
	"controllers"
	"controllers/api"
	"controllers/simulator"
	"controllers/user"
	"lib/gorilla/mux"
	"net/http"
)

func init() {
	// Set up the gorilla mux router
	router := mux.NewRouter().StrictSlash(true)
	http.Handle("/", router)

	// Handle unspecified routes with 404 handler
	router.NotFoundHandler = http.HandlerFunc(controllers.NotFoundHandler)

	// Simple dormant pages
	router.HandleFunc("/", controllers.HomeHandler)
	router.HandleFunc("/about", controllers.AboutHandler)
	router.HandleFunc("/faqs", controllers.FaqsHandler)
	router.HandleFunc("/feedback", controllers.FeedbackHandler)

	// Simulators
	router.HandleFunc("/simulator", simulator.BrowseHandler)
	router.HandleFunc("/simulator/browse", simulator.BrowseHandler)
	router.HandleFunc("/simulator/sandbox", simulator.NewSandboxHandler)
	router.HandleFunc("/simulator/sandbox/{simulatorId:[0-9]+}", simulator.EditSandboxHandler)
	router.HandleFunc("/simulator/kinematics", simulator.NewKinematicsHandler)
	router.HandleFunc("/simulator/kinematics/{simulatorId:[0-9]+}", simulator.EditKinematicsHandler)

	// User pages
	router.HandleFunc("/user/{userId:[0-9]+}", user.ProfileHandler)
	router.HandleFunc("/user/{userId:[0-9]+}/simulations", user.SimulationsHandler)

	// API Endpoint (Returns JSON)
	router.HandleFunc("/api/simulator/{simulatorId:[0-9]+}/comments", api.CommentHandler)

	// Test pages
	router.HandleFunc("/test/{testPage:[a-z]+}", controllers.TestHandler)
}
